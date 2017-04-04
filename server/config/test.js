var mongo_client = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var nodemailer = require('nodemailer');

var send_appraisal = function(details,callback){

  var increment=parseFloat(details.overall_score);
  console.log("increment % "+increment);

  if(increment>=30&&increment<=50){increment=0.025;}
  else if(increment>50&&increment<=75){increment=0.10;}
  else if(increment>75&&increment<=85){increment=0.15;}
  else if(increment>85&&increment<=100){increment=0.25;}

  console.log("\nafter if else"+increment);
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
  var text = 'Hello ' + details.personal_details.name +"\n peer score "+details.peer_score+"\n Manager Score"+details.self_score+"\n overall score"+details.overall_score+
  "\nYour increment is "+increased+"\n Your new CTC is"+newctc;
  var mailOptions = {
    from: 'last7439@gmail.com', // sender address
    to: details.personal_details.email, // list of receivers
    subject: 'Appraisal', // Subject line
    text: text ,//, // plaintext body
    html:  '<h4>Hello '+details.personal_details.name+'.Here is your Feedback</h4><div>Peer Score : '+details.peer_score+'</div><div>Manager Score : '+details.self_score+'</div><div>Overall Score : '+details.overall_score+'</div><h4>Your Salary Details</h4><div>Increment : '+increased+'</div><div>New CTC : '+newctc+'</div>'
  };

  transporter.sendMail(mailOptions, function(error, info){
    if(error){
      console.log(error);
      callback("not ok");
    }
    else{
      callback("ok");
    }
  });
};

  var testDoc={"submitted_by":"58da31b4ce06742b4c4f7dbf","self_score":"80","personal_details":{"_id":"58da31b4ce06742b4c4f7dc1","name":"Akkineni Susmitha","code":"234","date":"1995-12-26T18:30:00.000Z","father_name":"Naga Raju","gender":"female","email":"susmitha.akkineni999@gmail.com","designation":"HR","phone_number":7896541300,"key":"58da31b4ce06742b4c4f7dbf"},"salary_details":{"_id":"58e126fa6266dd9cebb7d8b6","key":"58da31b4ce06742b4c4f7dbf","ctc":"30000","variable_bonus":"3000","basic":"1000","house_rent_allowance":"2000","conveyance_allowance":"1000","medical_allowance":"2000","special_allowance":"1000","profession_tax":"2000"},"peer_score":62,"overall_score":71};

  send_appraisal(testDoc,function(res){
    console.log("res"+res);
  });