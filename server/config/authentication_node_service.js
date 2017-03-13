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
          db.close();//closing db connection
          callback("ok");
        }
        else{
          db.close();
          callback("not ok");
        }
      });

    
    });
 
  };


  this.add_employee = function(details,callback){
  // Connect to the db
    MongoClient.connect("mongodb://localhost/test", function(err, db) {
      if(err) { callback(err); }

      var doc = {
        'name':details.name,
        'code':details.code,
        'date':details.date,
        'father_name':details.father_name,
        'gender':details.gender,
        'email':details.email,
        'phone_number':details.phone_number

      };

      var collection = db.collection('personal_info');
  
      collection.insert(doc, {w:1}, function(err, result) {
        if(!err){
           db.close();//closing db connection
          callback("ok");
        }
        else{
          db.close();
          callback("not ok");
        }
      });

    
    });
 
  };

};

module.exports = authentication_node_service;


