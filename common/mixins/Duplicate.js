var async = require('async')
function Duplicate(Model){

  Model.duplicate = function (id, data, cb) {
    var self = this;
    var models = Model.app.models;
    var includeRelations = Object.keys(self.definition.settings.relations);

    self.findById(id, {include: includeRelations}, function(err, fromInstance){
      if(err){
        return cb(err);
      }

      var fromData = JSON.parse(JSON.stringify(fromInstance));
      //console.log(self.definition)
      for (var prop in data){
        if (self.definition.properties.hasOwnProperty(prop)){
          fromData[prop] = data[prop];
        }
      }
      delete fromData.id;
      self.create(fromData, function(err, newInstance){
        if(err){
          return cb(err);
        }
        var relations = self.definition.settings.relations;
        var operations = [];
        for(var relationName in relations){
          var relation = relations[relationName];
          switch(relation.type){
            case "hasAndBelongsToMany": //add extra links to relation
              if(relation.foreignKey == "") relation.foreignKey = "id";
            for(var i = 0; i < fromData[relationName].length; i++){
              var relatedItem = fromData[relationName][i];
              operations.push(async.apply(newInstance[relationName].add, relatedItem[relation.foreignKey]));
            }
            break;
            case "hasMany": //create extra items
              if(relation.through){
              //don copy many through relations, add an extra has many on the intermediate
            } else {
              // copy ze shit, and recursively check if child relations have to be duplicated
              for(var i = 0; i < fromData[relationName].length; i++) {
                var relatedItem = fromData[relationName][i];

                operations.push(async.apply(
                  function(relation, relatedItem, newInstance, cb2){
                    try {
                      models[relation.model].duplicate(relatedItem.id, function(err, duplicatedInstance){
                        if(err){
                          cb2(err);
                        }
                        var fk = relation.foreignKey || self.definition.name.substr(0, 1).toLowerCase() + self.definition.name.substr(1) + "Id";
                        duplicatedInstance.updateAttribute(fk, newInstance.id , cb2);
                      });
                    } catch(err){
                      cb2(err);
                    }
                  },
                  relation, relatedItem, newInstance));
              }
            }
            break;
            default: //do nothing
          }
        }

        if(operations.length > 0){
          async.parallel(operations, function (err, results) {
            if (err) cb(err);
            cb(null, newInstance);
          });
        } else {
          cb(null, newInstance);
        }
      });
    })
  }

  Model.observe('before save', function(ctx, next){
    if (typeof ctx.instance == "undefined"){
      return
    }
    if (typeof ctx.instance['version'] == "undefined"){
      ctx.instance["version"] = 0;
    } else {
      ctx.instance["version"] += 1;
    }
    next();
  });

  Model.remoteMethod(
    'duplicate',
    {
      http: {path: '/duplicate', verb: 'POST'},
      accepts: [{arg: 'id', type: 'number', http: { source: 'query'  } },
                {arg: 'data', type: 'object', http: { source: 'body'  } }
               ],
      returns: {arg: 'duplicate', type: 'object'}
    }

  );
}

//TODO: if the update is not the latest object, fail!
//Disable PUT
// If id is none fail
//If change name, fail
//verify name + store for uniqueness
//Create a utility method to 
module.exports = Duplicate;
