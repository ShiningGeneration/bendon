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

var createStore = function(apikey) {
    return frisby.create('Create Store')
      .post(base_url + "Stores/" + "?access_token=" + apikey, 
            {
              name: "津鮮蝦卷",
              address: "台北市信義路五段 108 號",
              phone: "02-3366-3948"
            }, 
            {json:true})
      .expectStatus(200)
      //.inspectJSON()
      .expectJSONTypes('', {
        name: String,
      })
      .afterJSON(function(resp){

        frisby.create('Create Product')
          .post(base_url + "Stores/" + resp.id + "/products" +"?access_token=" + apikey, 
                {
                  name: "蝦卷飯",
                  price: 100,
                }, 
                {json:true})
          .expectStatus(200)
          //.inspectJSON()
          .expectJSONTypes('', {
            name: String,
          })
          .toss()

        frisby.create('Create Product')
          .post(base_url + "Stores/" + resp.id + "/products" +"?access_token=" + apikey, 
                {
                  name: "雞腿飯",
                  price: 90,
                }, 
                {json:true})
          .expectStatus(200)
          //.inspectJSON()
          .expectJSONTypes('', {
            name: String,
          })
          .toss()
      })
}

var createEvent = function(apikey) {
    return frisby.create('Create Event')
      .post(base_url + "Events/" + "?access_token=" + apikey, 
            {
              name: "Mon. - 津鮮蝦卷",
              endedAt: new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
              
            }, 
            {json:true})
      .expectStatus(200)
      .inspectJSON()
      .expectJSONTypes('', {
        name: String,
      })
      .afterJSON(function(resp){
        //TODO: get store first
        for (var pid = 1; i < 3; i++){
          frisby.create('Add Products to Event')
            .put(base_url + "Events/" + resp.id + "/products/rel/" + pid + "?access_token=" + apikey, 
                  {
                  }, 
                  {json:true})
            .expectStatus(200)
            //.inspectJSON()
            .expectJSONTypes('', {
              name: String,
            })
            .toss()

        }
      })
}



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
        var apikey = resp.id
        createStore(apikey).
          afterJSON(function(resp){
            createEvent(apikey).toss()
        }).toss()
        //console.log(resp)
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
