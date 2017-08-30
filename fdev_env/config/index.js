var path = require('path');

module.exports = {
	dev:{
		proxyTable: {
		    target:'http://192.168.1.251:8188',
		    changeOrigin:true,
		    pathRewrite:{
		        '^/devapi':''
		    }
		}
	}
}