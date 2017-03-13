var express = require('express');
var app = express();
var mongoClient=require('mongodb').MongoClient;



app.use(express.static('public'));
app.use('/angular', express.static(__dirname + '/angular'));
var routes = require(__dirname+'/server/config/routes.js');
app.use(routes); 

var server = app.listen(8000, function () {
  var host = server.address().address
  var port = server.address().port
  console.log("Example app listening at http://%s:%s", host, port)
});


var mongoDbObj;
mongoClient.connect('mongodb://localhost/testDb', function(err, db) {
  if (err)
    console.log(err);
  else {
    console.log("Connected to MongoDB");
    mongoDbObj = {
      db: db,
      todoList: db.collection('todos')
    };
  }
});
