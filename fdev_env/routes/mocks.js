var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/getData', function(req, res, next) {
	console.log(req.path);
  res.send('respond with a resource');
});

module.exports = router;
