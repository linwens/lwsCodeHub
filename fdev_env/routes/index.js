var express = require('express');
var router = express.Router();
var authorize = require('../utils').authorize;//判断是否要登录

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
//页面需要登录
router.get('/auth.html', authorize, function(req,res,next){
	res.render('auth', { title: 'auth' });
});
//使用通配符，再根据url去查找文件目录
router.get('/*.html', function(req,res,next){
	res.render(req.path.slice(1,req.path.length-5), { title: 'Express' });
})

module.exports = router;
