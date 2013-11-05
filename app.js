
/**
 * Module dependencies.
 */

/**
 * 添加参照
 */
var express     = require("express")
  , http        = require("http")
  , i18n        = require("i18n")
  , path        = require("path")
  , store       = require("connect-mongo")(express)
  , confdb      = require("config").db
  , confsession = require("config").session
  , confapp     = require("config").app
  , confcookie  = require("config").cookie
  , routes      = require("./routes")
  , middleware  = require('./core/middleware');


/**
 * 国际化
 */
i18n.configure({"locales": ["en", "ja", "zh"]
  , "register": global
  , "updateFiles": false
});
i18n.setLocale("ja");

var app = express();

app.configure(function(){
  app.set("port", process.env.PORT || confapp.port || 3000);
  app.set("views", __dirname + "/views");
  app.set("view engine", "html");

  /**
   * Middleware
   * 生成标准favicon.ico，防止favicon.ico的404错误
   */
  // app.use(express.favicon());

  /**
   * Middleware
   * 记录Access log和Error log
   */
  app.use(express.logger("dev"));

  /**
   * Middleware
   * 压缩response data为gzip
   */
  // app.use(express.compress());

  /**
   * Middleware
   * 包含json(), urlencoded(), multipart()三个middleware
   */
  app.use(express.bodyParser({"uploadDir": confapp.tmp}));

  /**
   * Middleware
   * 用于模拟DELETE and PUT方法
   * 可以在form里放在<input type="hidden" name="_method" value="put" />来模拟
   */
  app.use(express.methodOverride());

  /**
   * Middleware
   * 解析cookie
   */
  app.use(express.cookieParser(confcookie.secret));

  /**
   * Middleware
   * 提供基于cookie的session
   */
  app.use(express.session({
    "secret": confsession.secret
    , "key": confsession.key
    , "cookie": {"maxAge": confsession.timeout * 60 * 60 * 1000}
    , "store": new store({"db": confdb.dbname, "host": confdb.host, "port": confdb.port})
  })
  );

  /**
   * Middleware
   * CSRF支持。需要在设定csrftoken的前面。
   */
  app.use(express.csrf());

  /**
   * 静态资源路径
   */
  app.use(express.static(__dirname + "/public"));

  /**
   * 系统定义
   */
  app.use(middleware.loadCompany);  // 加载用户的公司信息
  app.use(middleware.authenticate); // 认证
  app.use(middleware.csrftoken);    // 生成CsrfToken
  app.use(middleware.lang);         // 设定语言
  app.use(middleware.timeout);      // 设定超时

});

/**
 * 使用ejs模板
 */
app.engine("html", require("ejs").__express);

/**
 * 以开发模式启动是有效的设定放在这里
 */
app.configure("development", function(){
  app.use(express.errorHandler());
});

/**
 * route
 */
routes.guiding( app );

/**
 * 异常处理
 */
app.use(middleware.parseError);

/**
 * 启动服务
 */
http.createServer(app).listen(app.get("port"), function(){
  console.log("Express server listening on port " + app.get("port"));
});
