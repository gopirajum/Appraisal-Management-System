var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.json()); // for parsing application/json
router.use(bodyParser.urlencoded({ extended: true })); // for parsing       application/x-www-form-urlencoded

//authentication_node_service module
var authentication = new require('../controllers/authentication.js');
var authentication = new authentication(); 

//Middle ware that is specific to this router
router.use(function timeLog(req, res, next) {
  console.log('Time: ', Date.now());
  next();
});

router.post('/auth', function(req, res) {
  authentication.authenticate(req.body,function(status,details){
  	if(status=="ok"){
  		res.json(details);
  	} else {
  		res.status(400).send({
        message: 'This is an error!'
		  });
    }
  });  
});


router.post('/addEmployee', function(req, res) {
  authentication.add_employee(req.body,function(status){
  	if(status=="ok"){
      res.send('success');
    } else {
  		res.status(400).send({
     		message: 'This is an error!'
  		});
    }
  }); 
});

router.post('/updateEmployee', function(req, res) {
  authentication.update_employee(req.body,function(status) {
  	if(status=="ok"){
      res.send('success');
    } else {
  		res.status(400).send({
     		message: 'This is an error!'
  		});
    }
  }); 
});

router.post('/reset_password', function(req, res) {
  authentication.reset_password(req.body,function(status) {
    if(status=="ok") {
      res.send('success');
    } else {
      res.status(400).send({
        message: 'This is an error!'
      });
    }
  });
});

router.post('/peer_form_load', function(req, res) {
  authentication.peer_form_load(function(status,details) {
    if(status=="ok") {
      res.json(details);
    } else {
      res.status(400).send({
        message: 'This is an error!'
      });
    }
  });
});

router.post('/self_form_load', function(req, res) {
 authentication.self_form_load(function(status,details) {
   if(status=="ok") {
     res.json(details);
   } else {
     res.status(400).send({
       message: 'This is an error!'
     });
   }
 });
});

router.post('/appraisal_init', function(req, res) {
  authentication.appraisal_init(req.body,function(status) {
    if(status=="ok") {
      res.send("success");
    } else {
      res.status(400).send({
        message: 'This is an error!'
      });
    }
  });
});

router.post('/GetEmployees', function(req, res) {
  authentication.getEmployees(function(status,employees) {
    if(status=="ok") {
      res.json(employees);
    } else {
      res.status(400).send({
        message: 'This is an error!'
      });
    }
  }); 
});

router.post('/PutPeerForm', function(req, res) {
  authentication.putPeerForm(req.body,function(status) {
    if(status=="ok") {
      res.send('success');
    } else {
      res.status(400).send({
        message: 'This is an error!'
      });
    }
  });
});

router.post('/GetEmployees', function(req, res) {
 authentication.getEmployees(function(status,employees) {
   if(status=="ok"){
      res.json(employees);
    } else {
      res.status(400).send({
        message: 'This is an error!'
      });
    }
  });
});

module.exports = router;
