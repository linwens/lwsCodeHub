var path = require('path');

module.exports = {
	dev:{
		jsPath:{//js加工路径
			src:'public/javascripts/**/*.js',
			dist:'dist/js/'
		},
		cssPath:{//css加工路径
			src:'public/stylesheets/**/*.less',
			dist:'dist/css/'
		},
		devPort:8688,//本地开发端口号
		proxyTable: {//设置跨域地址和路径名称
		    '/devapi/':{
		        target:'http://192.168.1.251:8188',
		        changeOrigin:true,
		        pathRewrite:{
		            '^/devapi':''
		        }
		    }
		}
	}
}