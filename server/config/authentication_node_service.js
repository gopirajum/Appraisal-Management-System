// Retrieve
var MongoClient = require('mongodb').MongoClient;


var authentication_node_service = function(){

  this.authenticate = function(credentials,callback){
  // Connect to the db
    MongoClient.connect("mongodb://localhost/test", function(err, db) {
      if(err) { callback(err); }

      var collection = db.collection('login');
  
      var findEmail=credentials.email;
      var findPassword=credentials.password;

      collection.findOne({email:findEmail}, function(err, item) {
        if(item&&item.password==findPassword){
          callback("ok");
        }
        else{
          callback("not ok");
        }
      });

    
    });
 
  };

};

module.exports = authentication_node_service;


