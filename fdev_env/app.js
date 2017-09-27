var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var mocks = require('./routes/mocks');
//切换生产及开发环境
global.config = process.env.NODE_ENV === "development" ? require('./config').dev : require('./config').prod;

var index = require('./routes/index');

var app = express();
console.log(process.env.NODE_ENV);
console.log(config.assetsRoot);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('.html', require('ejs').renderFile);
app.set('view engine', 'html');
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/static', express.static(config.assetsRoot));

app.use(session({//默认存到内存中，可以设置存到redis(研究中)
    name:'gr_user_id',
    secret:'hqb',
    saveUninitialized: true,
    resave: true,
    cookie:{
        secure: config.cookies.secure,
        httpOnly: config.cookies.httpOnly,
        domain: config.cookies.domain,
        maxAge: config.cookies.maxAge
    }
}))
app.use(function(req, res, next){//实现ejs引擎里获取session的值
  res.locals.user = req.session.user?req.session.user:'';
  next();
})
//处理请求
app.use('/', mocks);
//页面渲染
app.use('/', index);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
