var express = require('express');
var router = express.Router();
var request = require('request');

router.get('/validimg', function(req, res, next) {//验证码
	var url = req.originalUrl;
	if(url.indexOf('?')!='-1'){
		var params = url.substr(url.indexOf('?'));
	}else{
		var params ='';
	}
	res.set('Content-Type','image/jpeg; charset=UTF-8')
	console.log(params);
	console.log(config.proxyDomain+'/validimg.html'+params);
	request.get({
		headers:{
			'Content-Type':'image/jpeg; charset=UTF-8'
		},
		url:config.proxyDomain+'/validimg.html'+params
	}).pipe(res);
});
router.post('/loginService', function(req, res, next) {//请求登录接口
	var url = req.originalUrl;
	if(url.indexOf('?')!='-1'){
		var params = url.substr(url.indexOf('?'));
	}
	request.post(config.proxyDomain+'/user/doLogin.htm', function (error, response, body) {
	  	res.send(body);//返回给前端
	  	if(body.res_code==1){//存session
	  		var user = {
	  			username:req.body.username,
	  			password:req.body.pwd
	  		}
	  		req.session.user = user;
	  	}else{
	  		console.log('未登录成功！');
	  	}
	});
});
module.exports = router;
