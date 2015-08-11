var loopback = require('loopback');

module.exports = function(Model, options) {
  Model.observe('before save', function(ctx, next){
    var currentUser = loopback.getCurrentContext().get('currentUser')
    if (currentUser) {
      ctx.instance['ownerId'] = currentUser.id
    } else {
      throw "Geee! We have a loophole in the ACL. Non-authorized user show not be able to create this Model";
    }
    next();
  });
}
