import gulp from 'gulp';
import babel from 'gulp-babel';//编译es6
import mocha from 'gulp-mocha';//测试用例
import eslint from 'gulp-eslint';//js代码规范
import rimraf from 'gulp-rimraf';//快速删除
import runSequence from 'run-sequence';

//less直接放express里解析，gulp就只处理js
var config = {
	jsPaths:{
		src:'./public/javascripts/**/*.js',
		dist:'./dist/js/'
	}
}

gulp.task('clean', () =>
  	gulp.src([config.jsPaths.dist])
    	.pipe(rimraf({ force: true }))
);
gulp.task('babel', ['babel-src']);

gulp.task('babel-src', ['lint-src'], () =>
  gulp.src(config.jsPaths.src)
    .pipe(babel())
    .pipe(gulp.dest(config.jsPaths.dist))
);

gulp.task('lint-src', () =>
  gulp.src(config.jsPaths.src)
    .pipe(eslint())
    .pipe(eslint.format())
    // To have the process exit with an error code (1) on
    // lint error, return the stream and pipe to failAfterError last.
    .pipe(eslint.failAfterError())
);

gulp.task('watch', () => {
  gulp.watch(config.jsPaths.src, ['babel-src', 'test']);
});

gulp.task('test', ['babel'], () =>
  gulp.src([config.jsPaths.dist])
    .pipe(mocha({ reporter: 'spec' }))
    .on('error', err => console.log(err.stack))
);

// Default Task
gulp.task('default', () =>
  runSequence('clean', ['babel', 'test'])
);
