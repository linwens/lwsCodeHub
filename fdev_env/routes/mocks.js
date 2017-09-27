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
	var data = req.body;
	var url = req.originalUrl;
	if(url.indexOf('?')!='-1'){
		var params = url.substr(url.indexOf('?'));
	}
	request.post({
		headers:{
			'X-Requested-With':'XMLHttpRequest'
		},
		url:config.proxyDomain+'/user/doLogin.htm'+params,
		form: data}, function (error, response, body) {
		console.log('----跳转---');
	  	var rslt = JSON.parse(body);
	  	//让后端传个token过来，所有请求都用这个token
	  	if(rslt.res_code==1){//存session
	  		var user = {
	  			username:req.body.username,
	  			password:req.body.pwd
	  		}
	  		req.session.token = 'usertokenvalue';
	  		console.log(req.session.token)
	  	}else{
	  		console.log(rslt.res_msg);
	  	}
	  	res.send(body);//待session存储处理完再返回前端，否则前端逻辑可能会在session存储前就执行了，导致session取不到
	});
});
module.exports = router;
