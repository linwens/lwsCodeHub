var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/activity/nationalDay.html', function(req, res, next) {
  res.render('activity/nationalDay', { title: 'Express' });
});

module.exports = router;
