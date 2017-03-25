var express = require('express');
var app = express();
app.use(express.static('public'));
app.use('/angular', express.static(__dirname + '/angular'));
var routes = require(__dirname+'/server/config/routes.js');
app.use(routes); 

var server = app.listen(9000, function () {
  var host = server.address().address
  var port = server.address().port
  console.log("Example app listening at http://%s:%s", host, port)
});
