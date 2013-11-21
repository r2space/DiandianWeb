
/**
 * Module dependencies.
 */

"use strict";

GLOBAL.smart = require("smartcore");

var http        = smart.lang.http
  , express     = smart.util.express
  , middleware  = smart.framework.middleware
  , loader      = smart.framework.loader
  , log         = smart.framework.log
  , routes      = require("./routes");

var app = express();

/**
 * 初始化smartcore模块
 */
loader.initialize();

/**
 * 初始化express模块
 */
loader.express(app);

app.use(middleware.lang);         // 设定语言
//app.use(middleware.loadCompany);  // 加载用户的公司信息
app.use(middleware.authenticate); // 认证
app.use(middleware.csrftoken);    // 生成CsrfToken
app.use(middleware.timeout);      // 设定超时

routes.guiding( app );

app.use(middleware.parseError);

/**
 * 启动服务
 */
var server = http.createServer(app).listen(app.get("port"), function(){
  log.info("Express server listening on port " + app.get("port"));
});
var io = require('socket.io').listen(server);

io.sockets.on('connection', function (socket) {

  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    socket.emit('news', { hello: 'fsafsdfdfsafsdfdsafsdf' });
  });

  socket.on('reconn', function (data) {
    socket.emit('reconn ed', { hello: 'success1' });
  });


});

