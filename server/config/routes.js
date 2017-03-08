var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.json()); // for parsing application/json
router.use(bodyParser.urlencoded({ extended: true })); // for parsing       application/x-www-form-urlencoded

//Middle ware that is specific to this router
router.use(function timeLog(req, res, next) {
  console.log('Time: ', Date.now());
  next();
});


// Define the home page route
router.post('/auth', function(req, res) {
  //console.log("req  email:"+req.body.email+" password: "+req.body.password);
  
  res.send('success');
});

// Define the about route
router.get('/about', function(req, res) {
  res.send('About us');
});


module.exports = router;