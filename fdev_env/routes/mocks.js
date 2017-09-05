var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/getData', function(req, res, next) {
	console.log(req.path);
  	res.send('respond with a resource');
});
router.post('/login', function(req, res, next) {
	var user = {
		username:req.body.username,
		password:req.body.pwd
	}
	req.session.user = user;
  	res.send('respond with a resource');
});
module.exports = router;
