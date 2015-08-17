var jasmine = require('jasmine');
var frisby = require('frisby');

var base_url = 'http://localhost:3000/api/'

var login = function(resp){
    return frisby.create('Log in')
      .post(base_url + "Users/login/", 
            {
              username: "mozuser",
              password: "firefoxos",
            }, 
            {json:true})
      .expectStatus(200)
      .inspectJSON()
      .expectJSONTypes('', {
        id: String,
        userId: Number
      })
}

var createEvent = 



frisby.create('Add a user')
  .post(base_url + "Users/", 
        {
          username: "mozuser",
          password: "firefoxos",
          email: "moz@moz.org"
        }, 
        {json:true})
  .expectStatus(200)
  .afterJSON(function(resp){

      login()
      .afterJSON(function(resp){
        console.log(resp)
      })
      .toss();
  })
  .toss();

/*
 Populate reference workload
 Create a user
   Login
     Create store
       Create products under it
     Create event: ongoing, expired, future
       Create products under events 
         Copy from store
       Create orders to the onging event
       Create orders to the expired event => blocked
       Create orders to the future event => blocked
 Logout
 Create users
   Login 
     Create group
       Add users to group
*/
