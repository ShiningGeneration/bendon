module.exports = function(Model, options) {
  Model.defineProperty('creatorId', {type: "number", default: undefined});
  Model.observe('before save', function(ctx, next){
    //var currentUser = ctx && ctx.get('currentUser');
    //var currentUser=ctx.user
      // Get the current access token
    //   var accessToken = ctx.get('accessToken');
    ctx.instance['creatorId'] = ctx
    /*
    if (currentUser) {
      //ctx.instance['creatorId'] = currentUser.id;
      ctx.instance['creatorId'] = ctx
    } else {
      throw "Geee! We have a loophole in the ACL. Non-authorized user show not be able to create this Model";
    }
    */
    next();
  });
}
