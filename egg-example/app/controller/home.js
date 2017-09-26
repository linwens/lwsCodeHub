//controller先简单的理解成请求处理
module.exports = app =>{
	/*class 定义一个类，等同于定义一个构造函数HomeController，同时这个构造函数继承app.Controller;
	 *app.Controller后的花括号里的代码是HomeController类的实际内容。
	**/
	class HomeController extends app.Controller{
		//Generator函数语法
		* index(){//其他模块调用这个controller的时候就写成app.controller.home.index
			this.ctx.body = 'Hello world';//不清楚
		}
	}
	return HomeController;
}