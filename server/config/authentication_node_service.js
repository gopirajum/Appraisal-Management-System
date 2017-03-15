var MongoClient = require('mongodb').MongoClient;

var authentication_node_service = function(){

  this.authenticate = function(credentials,callback){
  // Connect to the db
    MongoClient.connect("mongodb://localhost/test", function(err, db) {
      if(err) { callback(err,null); }

      var collection = db.collection('login');
  
      var findEmail=credentials.email;
      var findPassword=credentials.password;

      collection.findOne({email:findEmail}, function(err, item)
      {
        if(item&&item.password==findPassword){

          var personal_info_collection = db.collection('personal_info');
          personal_info_collection.findOne({email:findEmail}, function(err, item) {
            if(item){
              db.close();//closing db connection
              callback("ok",item);
            }
            else{
              db.close();//closing db connection
              callback("ok",null);
            }
          }); 
        }
        else{
          db.close();
          callback("not ok",null);
        }
      });

    
    });
 
  };


  this.add_employee = function(details,callback){
  // Connect to the db
    MongoClient.connect("mongodb://localhost/test", function(err, db) {
      if(err) { callback(err); }

      var collection = db.collection('personal_info');
  
      collection.insert(details, {w:1}, function(err, result) {
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

  this.update_employee = function(details,callback){
  // Connect to the db
    MongoClient.connect("mongodb://localhost/test", function(err, db) {
      if(err) { callback(err); }

      var collection = db.collection('personal_info');

      var keyemail=details.email;
      collection.remove({"email":keyemail}, {w:1}, function(err, result) {
        if(!err)
        {
          collection.insert(details, {w:1}, function(err, result) {
            if(!err){
              db.close();//closing db connection
              callback("ok");
            }
            else{
              db.close();
              callback("not ok");
            }
          });
        }
        else{
          callback("not ok");
        }

      });
        
    });
 
  };

};

module.exports = authentication_node_service;


