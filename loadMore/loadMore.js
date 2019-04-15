/**
 *思路：
 *1、wrapper容器固定不动，Scroller内容滚动
 *
 *
 *
 *
 *
 *
 *
 *
 *
**/



//以外部入参的形式获取window,document,Math对象,这样可以缩短访问这些变量的时间,因为访问的作用域链路径变短了
;(function (window,document,Math){
	//定义xxScroll构造函数
	function XXScroll(el,opt){//容器元素，配置选项
		/*构造函数里存方法执行的变量*/
		this.wrapper = el;//容器wrapper
		this.scroller = this.wrapper.children[0];//具体可以滑动的元素
		this.top = 0;//滑动内容Scroller与窗口容器wrapper边沿的距离
		this.bottom = 0;//滑动内容Scroller与窗口容器wrapper边沿的距离
		this.gup = 0;//滑动内容Scroller与窗口容器wrapper边沿的距离
		this.speed = 1;//滑动速度
		//scroller元素绑定事件
		var _that = this;
		this.scroller.addEventListener('touchstart',function(){
			console.log('滑动元素被触摸了');

		});
		this.scroller.addEventListener('touchmove',function(){
			console.log('滑动元素被移动了');
			/**
			 *scrollHeight = clientHeight + scrollTop + 剩余未显示高度距离
			 */
			console.log(_that.wrapper.scrollHeight)//整个元素内容的高度
			console.log(_that.wrapper.clientHeight)//视口高度
			console.log(_that.wrapper.scrollTop);//滚动条顶端距离视口顶端的距离==移出视口后隐藏的内容高度
		});
		this.scroller.addEventListener('touchend',function(){
			console.log('滑动元素触摸结束');
			_that._end();
		});
		//回弹效果
		/**
		 *自己的思路就是：拉的距离越远，移动速度越慢，从而产生被拖住的感觉。松掉就是touchend,速度加起来，Scroller回到底部0的位置
		 *
		**/
		//用力一划的效果，也可以依据速度判断

	};
	//XXScroll原型
	XXScroll.prototype = {
		/*原型里存方法*/
		/*--以下是处理函数，与事件对应--*/
		_start:function(){
			console.log(this.top)
		},
		_move:function(){},
		_end:function(){
			console.log(this.scroller);
		},
		/*--以下是运动函数，控制Scroller的移动--*/
		_translate:function(){}
	};
	window.XXScroll = XXScroll;
})(window,document,Math);