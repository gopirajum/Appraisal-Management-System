var mongo_client = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var nodemailer = require('nodemailer');

var add_employee = function(details,callback){
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

  var testDoc={
    "email":"susmitha.akkineni999@gmail.com",
    "name":"susi papa"
  };

  add_employee(testDoc,function(res){
    console.log("res"+res);
  });