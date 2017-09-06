//var proxy = require('express-http-proxy');
var proxy = require('http-proxy-middleware');
var mocks = require('./routes/mocks');

module.exports = function(app){
	if(!config.proxyTable){
		console.log('不需要跨域');
	}else{
		//跨域express转发并操作返回值
		app.use('/mocks', mocks);
		for(key in config.proxyTable){
		    // app.use(key, proxy(config.proxyTable[key].target,{
		    //     userResDecorator: function(proxyRes, proxyResData, userReq, userRes) {
		    //         data = JSON.parse(proxyResData.toString('utf8'));
		    //         data.newProperty = 'exciting data';
		    //         console.log(userReq._parsedUrl.pathname);//获取请求的接口名
		    //         console.log(data);
		    //         return JSON.stringify(data);
		    //     }
		    // }));
		    app.use(key, proxy(config.proxyTable[key]));
		}
	}
}


