import express from 'express';
import path from 'path';
import favicon from 'serve-favicon';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import lessMiddleware from 'less-middleware';
//跨域访问中间件
import config from './config';
import proxyMiddleware from 'http-proxy-middleware';

import index from './routes/index';//处理页面路由
import users from './routes/users';//处理请求url

let app = express();
// view engine setup  ///修改ejs渲染方式，express先解析HTML文件，同时能够渲染ejs的代码片段
app.set('views', path.join(__dirname, 'views'));
app.engine('.html', require('ejs').renderFile);
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(lessMiddleware(path.join(__dirname, 'public')));//less解析中间件
app.use(express.static(path.join(__dirname, 'public')));
//跨域处理
app.use('/devapi',proxyMiddleware(config.dev.proxyTable));

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use((req, res, next)=>{
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next)=>{
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
