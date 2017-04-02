var mongo_client = require('mongodb').MongoClient;
var nodemailer = require('nodemailer');

var authentication_node_service = function() {

  this.authenticate = function(credentials,callback){
    var employee={
      "key":null,
      "personal_details":null,
      "official_details":null
    };
    mongo_client.connect("mongodb://localhost/test", function(err, db) {
      if(err) { 
        callback(err,null); 
      }
      var collection = db.collection('login');
      var findEmail=credentials.email;
      var findPassword=credentials.password;
      collection.findOne({email:findEmail}, function(err, item) {
        if(item&&item.password==findPassword){
          employee.key=item._id;
          var personal_info_collection = db.collection('personal_info');
          personal_info_collection.findOne({key:item._id}, function(err, personalItem) {
            if(personalItem){
              employee.personal_details=personalItem;
              
            } else {
              db.close();
              callback("not ok",null);
            }
          }); 
          var official_details_collection = db.collection('official_details');
          official_details_collection.findOne({key:item._id}, function(err, officialItem) {

            if(officialItem){
              employee.official_details=officialItem;
              db.close();
              callback("ok",employee);
              
            } else {
              db.close();
              callback("not ok",null);
            }
          }); 

        } else {
          db.close();
          callback("not ok",null);
        }
      });
    });
  };


  this.add_employee = function(details,callback){
    mongo_client.connect("mongodb://localhost/test", function(err, db) {
      if(err) { 
        callback(err); 
      }
      var login_collection = db.collection('login');
      var access_token = Math.random().toString(16).substring(2,12);
      var login_doc={
        "email":details.email,
        "password":"",
        "access_token":access_token
      };
      login_collection.insert(login_doc, {w:1}, function(err, loginresult) {
        if(!err) {
          var collection = db.collection('personal_info');  
          details.key=loginresult.ops[0]._id//accessing the _id of login_doc inserted

          //inserting into official details
          var offcial_collection=db.collection('official_details');
          var doc={"key":details.key};
          offcial_collection.insert(doc, {w:1}, function(err, result) {
            if(err){
              db.close();
              callback("not ok");
            }
          });

          collection.insert(details, {w:1}, function(err, result) {
            if(!err) {
              //sending mail
              var transporter = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                  user: 'last7439@gmail.com', // Your email id
                  pass: 'navtechadmin' // Your password
                }
              });
              var text = 'Hello world from \n\n' + details.name +'your link is  '+'http://localhost:9000/#/reset_password/'+access_token;
              var mailOptions = {
                from: 'last7439@gmail.com', // sender address
                to: details.email, // list of receivers
                subject: 'Reset password', // Subject line
                text: text //, // plaintext body
                // html: '<b>Hello world ✔</b>' // You can choose to send an HTML body instead
              };

              transporter.sendMail(mailOptions, function(error, info){
                if(error){
                  console.log(error);
                  //res.json({yo: 'error'});
                  callback("not ok");
                }
                else{
                  console.log('Message sent: ' + info.response);
                  //res.json({yo: info.response});
                }
              });
              db.close();//closing db connection
              callback("ok");
            } else {
              db.close();
              callback("not ok");
            }
          });
        } else {
          db.close();
          callback("not ok");
        }
      });
    });
  };

  this.update_employee = function(details,callback){
    mongo_client.connect("mongodb://localhost/test", function(err, db) {
      if(err) { 
        callback(err); 
      }
      var collection = db.collection('personal_info');
      var keyemail=details.email;
      collection.remove({"email":keyemail}, {w:1}, function(err, result) {
        if(!err) {
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
        } else {
          callback("not ok");
        }
      });
    });
  };

  this.update_official_details = function(details,callback){
    mongo_client.connect("mongodb://localhost/test", function(err, db) {
      if(err) { 
        callback(err); 
      }
      var collection = db.collection('official_details');
      var key=details.key;
      collection.remove({"key":key}, {w:1}, function(err, result) {
        if(!err) {
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
        } else {
          callback("not ok");
        }
      });
    });
  };

  this.reset_password = function(details,callback){
    mongo_client.connect("mongodb://localhost/test", function(err, db) {
      if(err) { 
        callback(err); 
      }
      var collection = db.collection('login');
      collection.update({"access_token":details.access_token}, { $set:{"password":details.password,"access_token":""}}, {w:1}, function(err, result) {
        var resultObj=JSON.parse(result);
        if(err||!(resultObj.n)) { 
          db.close();
          callback("not ok"); 
        } else {
          db.close();
          callback("ok");
        }
      }); 
    });
  };

  this.peer_form_load = function(callback){
    mongo_client.connect("mongodb://localhost/test", function(err, db) {
      if(err) { 
        callback(err); 
      }
      var collection = db.collection('questions');
      collection.find({type:"peer"}).toArray(function(err, items) {
        if(items) {
          db.close();//closing db connection
          callback("ok",items);
        } else {
          db.close();//closing db connection
          callback("ok",null);
        }
      }); 
    });
  };

  this.self_form_load = function(callback){
    mongo_client.connect("mongodb://localhost/test", function(err, db) {
      if(err) { 
        callback(err); 
      }
      var collection = db.collection('questions');
      collection.find({type:"self"}).toArray(function(err, items) {
        if(items) {
          db.close();//closing db connection
          callback("ok",items);
        } else {
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

    mongo_client.connect("mongodb://localhost/test", function(err, db) {
      if(err) { 
        callback(err); 
      }
      var collection = db.collection('reviews');
      var selfCollection = db.collection('self_reviews');
      for(i in employees) {
        var urls=[];
        var names=[];
        var url,self_url;
        var access_token = Math.random().toString(16).substring(2,12);
        var doc1={
          "token":access_token,
          "submitted_by":employees[i].key,
          "questions":null
        }

        self_url="http://localhost:9000/#/home/self_form/"+access_token;
        selfCollection.insert(doc1, {w:1}, function(err, result) {
          if(err){db.close();callback(err);}
        });

        for(j in employees) {
          if(employees[i].key!=employees[j].key) {
            var access_token = Math.random().toString(16).substring(2,12);
            var doc2 = {
              "token":access_token,
              "submitted_by":employees[i].key,
              "submitted_to":employees[j].key
            }
            url="http://localhost:9000/#/home/peer_form/"+access_token;
            urls.push(url);
            names.push(employees[j].personal_details.name);
            collection.insert(doc2, {w:1}, function(err, result) {
              if(err){db.close();callback(err);}
            });
          }
        }
        //sending mail
        var text = "self assesment link is "+self_url+"\n";
        for(k in urls) {
          text=text+"peer review link of "+names[k]+" is "+urls[k]+"\n";
        }
        var mailOptions = {
          from: 'last7439@gmail.com', // sender address
          to: employees[i].personal_details.email, // list of receivers
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
   //console.log("in node server.js");
   mongo_client.connect("mongodb://localhost/test", function(err, db) {
      if(err) { 
        callback(err); 
      }
      var employees_list=[];
      var collection = db.collection('personal_info');
      var official_collection=db.collection('official_details');
      var selfReview_collection=db.collection('self_reviews');
      collection.find().toArray(function(err, items) {
        if(items) {
          var pushOfficialDetails = function(i,items,callbackpod){
            if(i<items.length){
              var empKey=items[i].key;
              var empPersonal_info=items[i];

              official_collection.findOne({key:items[i].key},function(err, item2) {
                //console.log("official "+JSON.stringify(item2));
                if(item2){
                   var empOfficial_details=item2;
                   var emp={
                    "key":empKey,
                    "personal_details":empPersonal_info,
                    "official_details":empOfficial_details
                  };
                  //console.log("337  "+JSON.stringify(emp)+"\n");
                  employees_list.push(emp);
                  //console.log("\nat i "+i);
                  pushQuestions(i,items,employees_list, function(){
                    pushOfficialDetails(i+1,items,function(empList){
                      //console.log("after recieving from"+(i+1));
                      callbackpod(empList);
                    });
                  });

                  //return employees_list;
                }else{
                  db.close();//closing db connection
                  //console.log(337);
                  callback(null);
                }
              });

            }
            else{
              callbackpod(employees_list);
            }
          }

          var pushQuestions = function(i,items,employees_list,callbackQ){
            if(i<items.length){
              
              selfReview_collection.findOne({submitted_by:""+items[i].key+""},function(err, item3) {
                //console.log("questions i"+i+"key "+items[i].key);
                if(item3){
                  //console.log("item3 "+item3);
                  employees_list[i].questions=item3.questions;
                  callbackQ();
                }else if(err){
                  db.close();//closing db connection
                  callback(null);
                }else{
                  employees_list[i].questions=null;
                  callbackQ();

                }
              });

            }
            else{
              callbackQ(employees_list);
            }
          }

          pushOfficialDetails(0,items,function(employees_list){
            db.close();//closing db connection
            /*console.log("354"+employees_list);
            for(j in employees_list){
              console.log("\n at 355 "+JSON.stringify(employees_list[j]));
            }
            console.log("before final callback");*/
            callback("ok",employees_list);

          });
            
        } else {
          db.close();//closing db connection
          console.log("350");
          callback("not ok",null);
        }
      }); 
    });
  };

  //submitting peer_form
  this.putPeerForm = function(details,callback){
    mongo_client.connect("mongodb://localhost/test", function(err, db) {
      if(err) { 
        callback(err); 
      }
      var collection = db.collection('reviews');
      //console.log("in node servcie"+details.score);
       collection.update({"token":details.review_token}, { $set:{"score":details.score,"token":""}}, {w:1}, function(err, result) {
        var resultObj=JSON.parse(result);
        if(err||!(resultObj.n)) { 
          db.close();
          callback("not ok"); 
        } else {
          db.close();
          callback("ok");
        }
      }); 
    });
  };

  //submitting self_form
  this.putSelfForm = function(details,callback){
    mongo_client.connect("mongodb://localhost/test", function(err, db) {
      if(err) { 
        callback(err); 
      }
      var collection = db.collection('self_reviews');
      //console.log("in node servcie"+details.score);
       collection.update({"token":details.review_token}, { $set:{"questions":details.questions,"token":""}}, {w:1}, function(err, result) {
        var resultObj=JSON.parse(result);
        if(err||!(resultObj.n)) { 
          db.close();
          callback("not ok"); 
        } else {
          db.close();
          callback("ok");
        }
      }); 
    });
  };

  //submitting self score
  this.putSelfScore = function(details,callback){
    mongo_client.connect("mongodb://localhost/test", function(err, db) {
      if(err) { 
        callback(err); 
      }
      var collection = db.collection('self_reviews');
      var peerCollection = db.collection('reviews');
      var peerScore=0;
      var n=0;
      peerCollection.find({"submitted_to":details.submitted_by}).toArray(function(err, items) {
        if(items){
          for(i in items){
            peerScore=peerScore+parseInt(items[i].score);
            n++;
          }
          peerScore=peerScore/n;
        }
          //console.log("in node servcie"+details.score);
        collection.update({"submitted_by":details.submitted_by}, { $set:{"peer_score":peerScore,"self_score":details.self_score}}, {w:1}, function(err, result) {
          var resultObj=JSON.parse(result);
          //console.log(resultObj);
          if(err||!(resultObj.n)) { 
            db.close();
            callback("not ok",null); 
          } else {
            details.peer_score=peerScore;
            db.close();
            callback("ok",details);
          }
        }); 

      });

    });
      
  }; 

};

module.exports = authentication_node_service;
