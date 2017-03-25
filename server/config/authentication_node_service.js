var MongoClient = require('mongodb').MongoClient;
var nodemailer = require('nodemailer');


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

      var login_collection = db.collection('login');
      var access_token = Math.random().toString(16).substring(2,12);
      var login_doc={
        "email":details.email,
        "password":"",
        "access_token":access_token
      };

      login_collection.insert(login_doc, {w:1}, function(err, loginresult) {
        if(!err){
        var collection = db.collection('personal_info');  

        details.key=loginresult.ops[0]._id//accessing the _id of login_doc inserted
        collection.insert(details, {w:1}, function(err, result) {
          if(!err){

            //sending mail
            var transporter = nodemailer.createTransport({
              service: 'Gmail',
              auth: {
                      user: 'last7439@gmail.com', // Your email id
                      pass: 'navtechadmin' // Your password
                    }
            });

          
             var text = 'Hello world from \n\n' + details.name +'your link is  '+'http://localhost:8000/#/reset_password/'+access_token;

            var mailOptions = {
              from: 'last7439@gmail.com', // sender address
              to: details.email, // list of receivers
              subject: 'Email Example', // Subject line
              text: text //, // plaintext body
              // html: '<b>Hello world ✔</b>' // You can choose to send an HTML body instead
            };

            transporter.sendMail(mailOptions, function(error, info){
              if(error){
                console.log(error);
                res.json({yo: 'error'});
              }
              else{
                console.log('Message sent: ' + info.response);
                res.json({yo: info.response});
              }
            });

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
              console.log("document inserted: "+result);
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

  this.reset_password = function(details,callback){
  
     //Connect to the db
    MongoClient.connect("mongodb://localhost/test", function(err, db) {
      if(err) { callback(err); }

       var collection = db.collection('login');
       collection.update({"access_token":details.access_token}, { $set:{"password":details.password,"access_token":""}}, {w:1}, function(err, result) {
        //console.log("result after update"+JSON.stringify(result));
        var resultObj=JSON.parse(result);
        if(err||!(resultObj.n)) { 
          db.close();
          callback("not ok"); }
        else{
          db.close();
          callback("ok");
        }
       });
       
    });
  };

  this.peer_form_load = function(callback){
  
     //Connect to the db
    MongoClient.connect("mongodb://localhost/test", function(err, db) {
      if(err) { callback(err); }

       var collection = db.collection('questions');
       collection.find().toArray(function(err, items) {
        if(items){
              db.close();//closing db connection
              callback("ok",items);
            }
            else{
              db.close();//closing db connection
              callback("ok",null);
            }

       });
       
    });
  };

  this.appraisal_init= function(employees,callback){
    var transporter = nodemailer.createTransport({
              service: 'Gmail',
              auth: {
                      user: 'last7439@gmail.com', // Your email id
                      pass: 'navtechadmin' // Your password
                    }
            });

    MongoClient.connect("mongodb://localhost/test", function(err, db) {
    if(err) { callback(err); }
    var collection = db.collection('reviews');
      for(i in employees)
      {
        var urls=[];
        var names=[];
        var url,self_url;
        var access_token = Math.random().toString(16).substring(2,12);
          var doc={
            "token":access_token,
             "submitted_by":employees[i]._id,
             "submitted_to":""
          }
          self_url="http://localhost:8000/#/home/self_form/"+access_token;
          //urls.push(url);
          collection.insert(doc, {w:1}, function(err, result) {
            if(err){db.close();callback(err);}
          });

          for(j in employees){
            if(employees[i]._id!=employees[j]._id)
            {
              var access_token = Math.random().toString(16).substring(2,12);
              var doc={
              "token":access_token,
              "submitted_by":employees[i]._id,
              "submitted_to":employees[j]._id
              }
              url="http://localhost:8000/#/home/peer_form/"+access_token;
              urls.push(url);
              names.push(employees[j].name);
              collection.insert(doc, {w:1}, function(err, result) {
                if(err){db.close();callback(err);}
              });

            }
          }

                      //sending mail
            

            var text = "self assesment link is "+self_url+"\n";
            for(k in urls)
            {
              text=text+"peer review link of "+names[k]+" is "+urls[k]+"\n";
            }
            var mailOptions = {
              from: 'last7439@gmail.com', // sender address
              to: employees[i].email, // list of receivers
              subject: 'Appraisal', // Subject line
              text: text //, // plaintext body
              //html: text // You can choose to send an HTML body instead
            };

            transporter.sendMail(mailOptions, function(error, info){
              if(error){
                console.log(error);
                res.json({yo: 'error'});
              }
              else{
                console.log('Message sent: ' + info.response);
                res.json({yo: info.response});
              }
            });

      
      }
      db.close();
      callback("ok");
    });
  };

  this.getEmployees=function(callback){
   MongoClient.connect("mongodb://localhost/test", function(err, db) {
      if(err) { callback(err); }

       var collection = db.collection('personal_info');
       collection.find().toArray(function(err, items) {
        if(items){
              db.close();//closing db connection
              callback("ok",items);
            }
            else{
              db.close();//closing db connection
              callback("ok",null);
            }

       });
       
    });
  };

  //submitting peer_form
  this.putPeerForm = function(details,callback){
  
     //Connect to the db
    MongoClient.connect("mongodb://localhost/test", function(err, db) {
      if(err) { callback(err); }

       var collection = db.collection('reviews');
       console.log("in node servcie"+details.score);
       collection.update({"token":details.review_token}, { $set:{"score":details.score,"token":""}}, {w:1}, function(err, result) {
        //console.log("result after update"+JSON.stringify(result));
        var resultObj=JSON.parse(result);
        //console.log("bool test "+!(resultObj.n)+" ok "+resultObj.ok+"obj string"+result+"obj"+resultObj);
        if(err||!(resultObj.n)) { 
          db.close();
          callback("not ok"); }
        else{
          db.close();
          callback("ok");
        }
       });
       
    });
  };

};

module.exports = authentication_node_service;


