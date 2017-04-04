var mongo_client = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
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

          var salary_collection = db.collection('salary_details');
          salary_collection.findOne({key:item._id}, function(err, salaryItem) {
            if(salaryItem){
              employee.salary_details=salaryItem;
              
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
          details.key=loginresult.ops[0]._id//accessing the _id of login_doc inserted

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
              callback("not ok");
            }
            else{
              //inserting into personal info
              var collection = db.collection('personal_info');  
              collection.insert(details, {w:1}, function(err, result) {
                if(err) {
                  db.close();
                  callback("not ok");
                }else{
                  //inserting into official details
                  var offcial_collection=db.collection('official_details');
                  var doc={"key":details.key};
                  offcial_collection.insert(doc, {w:1}, function(err, result) {
                    if(err){
                      db.close();
                      callback("not ok");
                    }
                    else{
                      //inserting into salary details
                      var salary_collection=db.collection('salary_details');
                      var doc={"key":details.key};
                      salary_collection.insert(doc, {w:1}, function(err, result) {
                        if(err){
                          db.close();
                          callback("not ok");
                        }else{
                          db.close();//closing db connection
                          callback("ok");
                        }
                      });

                    }
                  });                  
                }
              });
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
      var id = new ObjectID(details._id);

      collection.update({_id:id}, {
         $set:{
          name:details.name,
          code:details.code,
          date:details.date,
          father_name:details.father_name,
          gender:details.gender,
          email:details.email,
          designation:details.designation,
          phone_number:details.phone_number
         }
        },
       {w:1}, function(err, result) {
        if(err){
          db.close();
          callback("not ok");
        }else{
          db.close();
          callback("ok");
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
      var id = new ObjectID(details._id);

      collection.update({_id:id}, {
         $set:{
          joining_date:details.joining_date,
          confirmation_period:details.confirmation_period,
          job_type:details.job_type,
          department:details.department,
          designation:details.designation,
          location:details.location,
          manager_name:details.manager_name,
          salary_account_number:details.salary_account_number,
          pan_number:details.pan_number,
          pf_number:details.pf_number
         }
        },
       {w:1}, function(err, result) {
        if(err){
          db.close();
          callback("not ok");
        }else{
          db.close();
          callback("ok");
        }

      });
    });
  };

  this.update_salary_details = function(details,callback){
    mongo_client.connect("mongodb://localhost/test", function(err, db) {
      if(err) { 
        callback(err); 
      }
      var collection = db.collection('salary_details');
      var id = new ObjectID(details._id);

      collection.update({_id:id}, {
         $set:{
          ctc:details.ctc,
          variable_bonus:details.variable_bonus,
          basic:details.basic,
          house_rent_allowance:details.house_rent_allowance,
          conveyance_allowance:details.conveyance_allowance,
          medical_allowance:details.medical_allowance,
          special_allowance:details.special_allowance,
          profession_tax:details.profession_tax
         }
        },
       {w:1}, function(err, result) {
        if(err){
          db.close();
          callback("not ok");
        }else{
          db.close();
          callback("ok");
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

  this.send_appraisal = function(details,callback){

  var increment=parseFloat(details.overall_score);
  //console.log("increment % "+increment);

  if(increment>=30&&increment<=50){increment=0.025;}
  else if(increment>50&&increment<=75){increment=0.10;}
  else if(increment>75&&increment<=85){increment=0.15;}
  else if(increment>85&&increment<=100){increment=0.25;}

  //console.log("\nafter if else"+increment);
  var increased = parseFloat(details.salary_details.basic)*increment;
  var newBasic=parseFloat(details.salary_details.basic)+increased;
  var newctc=parseFloat(details.salary_details.ctc)+increased;

  //sending mail
  var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'last7439@gmail.com', // Your email id
      pass: 'navtechadmin' // Your password
    }
  });
  var text = 'Hello ' + details.personal_details.name +"\nPeer score "+details.peer_score+"\nManager Score "+details.self_score+"\nOverall score "+details.overall_score+
  "\nYour increment is "+increased+"\nYour new CTC is "+newctc;
  var mailOptions = {
    from: 'last7439@gmail.com', // sender address
    to: details.personal_details.email, // list of receivers
    subject: 'Appraisal', // Subject line
    text: text //, // plaintext body
    // html: '<b>Hello world ✔</b>' // You can choose to send an HTML body instead
  };

  transporter.sendMail(mailOptions, function(error, info){
    if(error){
      console.log(error);
      callback("not ok");
    }
    else{
      //updating the salary
      mongo_client.connect("mongodb://localhost/test", function(err, db) {
        if(err) { 
          callback(err); 
        }
        var collection = db.collection('salary_details');
        var id = new ObjectID(details.salary_details._id);

        collection.update({_id:id}, {$set:{ctc:newctc,basic:newBasic}},{w:1}, function(err, result) {
          if(err){
            db.close();
            callback("not ok");
          }else{
            db.close();
            callback("ok");
          }

        });
      });
    }
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
      var salary_collection=db.collection('salary_details');
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
                  pushSalaryDetails(i,items,employees_list, function(){
                    pushQuestions(i,items,employees_list, function(){
                      pushOfficialDetails(i+1,items,function(empList){
                        //console.log("after recieving from"+(i+1));
                        callbackpod(empList);
                      });
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
              callbackQ();
            }
          }

          var pushSalaryDetails = function(i,items,employees_list,callbackSD){
            if(i<items.length){
              
              salary_collection.findOne({key:items[i].key},function(err, item4) {

                if(item4){

                  employees_list[i].salary_details=item4;
                  callbackSD();
                }else if(err){
                  db.close();//closing db connection
                  callback(null);
                }
              });

            }
            else{
              callbackQ();
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
