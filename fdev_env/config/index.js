var path = require('path');

module.exports = {
	prod:{
		assetsRoot: path.resolve(__dirname, './static'),//生产环境建个static存放静态资源
		cookies:{
			secure: true,//确保浏览器使用HTTPS发送cookie
			httpOnly: true,//确保cookie仅通过HTTP(S)被发送，而不是客户端的JavaScript。用来帮助抵御跨站脚本攻击。
			domain: 'www.hqblicai.com',//确保在指定域名下才发送cookies
			maxAge:600000//cookie有效期
		}
	},
	dev:{
		assetsRoot: path.resolve(__dirname, './dist'),
		jsPath:{//js加工路径
			src:'public/javascripts/**/*.js',
			dist:'dist/js/'
		},
		cssPath:{//css加工路径
			src:'public/stylesheets/**/*.less',
			dist:'dist/css/'
		},
		imgPath:{//img加工路径
			src:'public/images/**/*.{png,jpg,gif,ico}',
			dist:'dist/img/'
		},
		cookies:{
			secure: false,
			httpOnly: false,
			domain: null,
			maxAge:600000
		},
		devPort:8688,//本地开发端口号
		proxyTable: {//设置跨域地址和路径名称
		    '/devapi/':{
		        target:'http://192.168.1.251:8188'
		    }
		}
	}
}