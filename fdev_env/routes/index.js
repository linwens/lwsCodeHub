var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
//使用通配符，再根据url去查找文件目录
router.get('*',function(req,res,next){
	res.render(req.path.slice(1,req.path.length-5), { title: 'Express' });
})

module.exports = router;
