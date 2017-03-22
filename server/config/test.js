this.appraisal_init= function(employees,callback){
    for(i in employees)
    {

      
    }
    //callback("ok");
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
          	 "submitted_by":"",
          	 "submitted_to":employees[i]._id
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
          	 	"submitted_by":employees[j]._id,
          	 	"submitted_to":employees[i]._id
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
            var transporter = nodemailer.createTransport({
              service: 'Gmail',
              auth: {
                      user: 'last7439@gmail.com', // Your email id
                      pass: 'navtechadmin' // Your password
                    }
            });

            var text = "self assesment "+self_url+"\n";
            for(k in urls)
            {
            	text=text+"peer review link of "+names[k]+" is "+urls[k]+"\n";
            }

            var mailOptions = {
              from: 'last7439@gmail.com', // sender address
              to: employees[i].email, // list of receivers
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

      
     	}
     	db.close();
     	callaback("ok");
    });
  };


  this.putPeerForm = function(details,callback){
  
     //Connect to the db
    MongoClient.connect("mongodb://localhost/test", function(err, db) {
      if(err) { callback(err); }

       var collection = db.collection('reviews');
       collection.update({"review_token":details.review_token}, { $set:{"score":details.score,"review_token":""}}, {w:1}, function(err, result) {
        console.log("result after update"+JSON.stringify(result));
        if(err) { 
          db.close();
          callback("not ok"); }
        else{
          db.close();
          callback("ok");
        }
       });
       
    });
  };