//配置文件
exports.keys = 'lwssecret';
//添加view配置
exports.view = {
	defaultViewEngine: 'nunjucks',
	mapping: {
		'.tpl':'nunjucks'//指定.tpl后缀名的文件使用nunjucks模板引擎
	}
}
//添加news请求的配置项
exports.news = {
	pageSize: 5,
	serverUrl: 'https://hacker-news.firebaseio.com/v0',
};
//测试中间件增加的配置
exports.middleware = [
	'robot'
];
exports.robot = {
	ua:[
		/Baiduspider/i,
	]
}