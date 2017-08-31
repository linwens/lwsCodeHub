/***
 *基本：
 *1、babel处理es6--ok
 *2、less解析成css--ok
 *3、图片压缩--环境各种报错
 *4、实时监听静态资源(css,js)变化，并刷新浏览器--ok
 *******
 *build静态资源：
 *静态资源路径动态修改
 *静态资源压缩
 *生成sourcemap以便调试
 *源代码删除后，及时清理处理后的代码
**/

var gulp = require('gulp');
var babel = require('gulp-babel');
var less = require('gulp-less');
var autoprefixer = require('gulp-autoprefixer');
var cache = require('gulp-cache');
var browserSync = require('browser-sync').create();
var path = require('path');

var config = {
	jsPath:{
		src:'public/javascripts/**/*.js',
		dist:'dist/js/'
	},
	cssPath:{
		src:'public/stylesheets/**/*.less',
		dist:'dist/css/'
	}
}
//babel转换es5
gulp.task('babel', function (){
    return gulp.src('public/javascripts/**/*.js')
        .pipe(babel({
            presets: ['env']
        }))
        .pipe(gulp.dest('dist/js/'))
});
//less转换css
gulp.task('less', function (){
  	return gulp.src('public/stylesheets/**/*.less')
    	.pipe(less({
      		paths: [ path.join(__dirname, 'less', 'includes') ]
    	}))
    	.pipe(autoprefixer({//css兼容前缀生成
    	    browsers: ['last 2 versions', 'Android >= 4.0','>5%'],//所有主流浏览器的最新两个版本，安卓4.0以上，使用率5%以上的浏览器
    	    cascade: true, //是否美化属性值(对齐)，默认true
    	    remove:true //是否去掉不必要的前缀 默认：true
    	}))
    	.pipe(gulp.dest('dist/css/'));
});
//发布线上
gulp.task('build',[],function(){
	//后期优化
});
//监听静态资源变化，热更新
gulp.task('default',['babel','less'], function(){
	browserSync.init({
		proxy: "http://localhost:3000",//指向本地node服务，需要可配
    	browser: "chrome"//官方文档错误，写Google chrome是找不到的
    });
	gulp.watch('public/stylesheets/**/*.less',['less']);
	gulp.watch('public/javascripts/**/*.js',['babel']);
	gulp.watch(['views/**/*.html', 'dist/js/**/*.js', 'dist/css/**/*.css']).on("change",browserSync.reload);
});