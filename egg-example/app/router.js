module.exports = app => {//配置路由映射
	app.get('/', app.controller.home.index);
	app.get('/news', app.controller.news.list);
}