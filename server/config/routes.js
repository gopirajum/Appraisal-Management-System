var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.json()); // for parsing application/json
router.use(bodyParser.urlencoded({ extended: true })); // for parsing       application/x-www-form-urlencoded

//authentication_node_service module
var authentication_node_service =require('./authentication_node_service.js');
var authentication_node_serviceInstance= new authentication_node_service(); 

//Middle ware that is specific to this router
router.use(function timeLog(req, res, next) {
  console.log('Time: ', Date.now());
  next();
});


// Define the home page route
router.post('/auth', function(req, res) {
  //console.log("req  email:"+req.body.email+" password: "+req.body.password);
  authentication_node_serviceInstance.authenticate(req.body,function(status,details)
  {
  	if(status=="ok"){
  		res.json(details);
  	}
  	else{
  		res.status(400).send({
   		message: 'This is an error!'
		});
  }
});
  
});


router.post('/addEmployee', function(req, res) {

  authentication_node_serviceInstance.add_employee(req.body,function(status)
  {
  	if(status=="ok"){res.send('success');}
  	else{
  		console.log("in routes.js else part");
  		res.status(400).send({
   		message: 'This is an error!'
		});
  }
});
  
});

router.post('/updateEmployee', function(req, res) {

  authentication_node_serviceInstance.update_employee(req.body,function(status)
  {
  	if(status=="ok"){res.send('success');}
  	else{
  		res.status(400).send({
   		message: 'This is an error!'
		});
  }
});
  
});

router.post('/reset_password', function(req, res) {

  authentication_node_serviceInstance.reset_password(req.body,function(status)
  {
    if(status=="ok"){res.send('success');}
    else{
      res.status(400).send({
      message: 'This is an error!'
    });
  }
});
  
});

// Define the about route
router.get('/about', function(req, res) {
  res.send('About us');
});


module.exports = router;