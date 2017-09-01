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
var runSequence = require('run-sequence');
var browserSync = require('browser-sync').create();
var nodemon = require('gulp-nodemon');
var path = require('path');
var del = require('del');

var config = require('./config');
// 删除文件
gulp.task('clean', function(cb) {
    return del(['dist/css/*', 'dist/js/*', 'dist/img/*'], cb)
});
//babel转换es5
gulp.task('babel', function (){
    return gulp.src(config.dev.jsPath.src)
        .pipe(babel({
            presets: ['env']
        }))
        .pipe(gulp.dest(config.dev.jsPath.dist))
});
//less转换css
gulp.task('less', function (){
  	return gulp.src(config.dev.cssPath.src)
    	.pipe(less({
      		paths: [ path.join(__dirname, 'less', 'includes') ]
    	}))
    	.pipe(autoprefixer({//css兼容前缀生成
    	    browsers: ['last 2 versions', 'Android >= 4.0','>5%'],//所有主流浏览器的最新两个版本，安卓4.0以上，使用率5%以上的浏览器
    	    cascade: true, //是否美化属性值(对齐)，默认true
    	    remove:true //是否去掉不必要的前缀 默认：true
    	}))
    	.pipe(gulp.dest(config.dev.cssPath.dist));
});
//发布线上,清除代码并美化压缩js，css文件
gulp.task('build', function(){//gulp正在监听，这时候打包会报错
	runSequence('clean', ['babel', 'less'])
});

//启动node服务
gulp.task('nodemon',function(cb){
    var started = false;
    return nodemon({
      script: 'bin/www'
    }).on('start', function () {
      // to avoid nodemon being started multiple times
      // thanks @matthisk
      if (!started) {
        cb();
        started = true;
      } 
    });
});

gulp.task('browser-sync', ['nodemon'], function() {
    browserSync.init({
        proxy: process.env.PORT?"http://localhost:"+process.env.PORT:"http://localhost:3000",
        browser: "chrome",
        port: config.dev.devPort
    });
});
//监听静态资源变化，热更新
gulp.task('default',['browser-sync'], function(){
	gulp.watch(config.dev.cssPath.src,['less']);
	gulp.watch(config.dev.jsPath.src,['babel']);
	gulp.watch(['views/**/*.html', 'dist/js/**/*.js', 'dist/css/**/*.css']).on("change",browserSync.reload);
});