var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
//测试路由自动
router.get('/activity/nationalday.html', function(req, res, next) {
	var path = getPath(req);
  	res.render(path, { title: 'Express' });//路径前不能加‘/’,否则就搜索绝对路径了，会出错
});

//截取页面path
function getPath(req){
	var path = req.path;
	if(path){
		path = path.slice(1,path.length-5);//直接把后面的.html删掉
	}
	return path;
}

module.exports = router;
