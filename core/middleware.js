
var i18n    = require('i18n')
  , fs      = require('fs')
  , confapp = require("config").app
  , company = require("../controllers/ctrl_company")
  , smart   = require("smartcore")
  , json    = smart.core.json
  , errors  = smart.core.errors
  , util    = smart.core.util
  , log     = smart.core.log;

/**
 * 设定语言
 */
exports.lang = function(req, res, next) {

  // set default
  if(req.session.user && req.session.user.lang){
    i18n.setLocale(req.session.user.lang);
    if(req.session.localJS){
      res.locals.i18n = req.session.localJS;
    }else{
      var local = fs.readFileSync("locales/" + req.session.user.lang + ".js","utf8");
      local = local.replace(/[\r\n]/g,"").replace(/"/g,"'");
      res.locals.i18n = local;
      req.session.localJS = local;
    }
  }else{
    res.locals.i18n = "";
  }

  
  res.locals.i = function() {
    return i18n.__.apply(req, arguments);
  };
  res.locals.n = function() {
    return i18n.__n.apply(req, arguments);
  };

  next();
}

/**
 * 未捕获的异常
 */
exports.parseError = function(err, req, res, next) {
  log.out("debug", err);
  json.send(res, new errors.InternalServer());
}

/**
 * Authenticate:
 *  Check the approval status.
 *  The configure of app.js, the handle has been registered.
 */
exports.authenticate = function(req, res, next) {
  
  // 不需要验证的页面（TODO: 将list移到配置文件里）
  var safety = false;

  // Static
  safety = safety || req.url.match(/^\/stylesheets/i);
  safety = safety || req.url.match(/^\/javascripts/i);
  safety = safety || req.url.match(/^\/vendor/i);
  safety = safety || req.url.match(/^\/images/i);
  safety = safety || req.url.match(/^\/video/i);

  // Login
  safety = safety || req.url.match(/^\/$/i);
  safety = safety || req.url.match(/^\/simplelogin.*/i);
  safety = safety || req.url.match(/^\/simplelogout.*/i);
  safety = safety || req.url.match(/^\/login.*/i);

  // Register
  safety = safety || req.url.match(/^\/register.*/i);
  safety = safety || req.url.match(/^\/download.*/i);
  safety = safety || req.url.match(/^\/device\/register\.json.*/i);

  if (safety) {
    return next();
  }

  // 确认Session里是否有用户情报
  if (req.session.user) {
//    var user = req.session.user;
//    var code = req.params ? req.params.code: undefined;
//    if(user.type == 0 || user.type == 1) { // Company's general user  and system user
//      var company_code = user.company ? user.company.code : undefined;
//       if(!code || code != company_code) {
//         return next(new errors.InternalServer("没有权限登陆"));
//       }
//    }

    return next();
  }

  // 确认cookie，生成Session情报
  //var cookie = auth.passCookie(req)
  //if (cookie) {
  //  user.at(cookie[0], function(err, result){
  //    if (!err && result) {
  //      req.session.user = result;
  //      return next();  
  //    }
  //  });
  //}

  // TODO: 在API内，不应该有迁移控制，应该拿到客户端实现。和Oauth一起实现
  if (util.isBrowser(req)) {
   return res.redirect("/login");
  }

  // 401 Unauthorized
  throw new errors.Unauthorized("Not logged in");
};

/**
 * Csrftoken:
 *  To implant csrf token in the Request.
 *  The configure of app.js, the handle has been registered.
 */
exports.csrftoken = function(req, res, next) {
  
  // 设定token的全局变量
  res.setHeader("csrftoken", req.session._csrf);
  res.locals({"csrftoken": req.session._csrf});
  next();
};

/**
 * 设定客户端请求超时
 */
exports.timeout = function(req, res, next) {

  // 上传下载的请求，不设定超时
  var isUpload = false;
  isUpload = isUpload || req.url.match(/^\/file\/download\.json/i);
  isUpload = isUpload || req.url.match(/^\/file\/upload\.json/i);
  isUpload = isUpload || req.url.match(/^\/gridfs\/save\.json/i);
  isUpload = isUpload || req.url.match(/^\/picture\//i);
  isUpload = isUpload || req.url.match(/^\/download\//i);
  isUpload = isUpload || req.url.match(/^\/material\/download\.json/i);

  if (!isUpload) {
    req.connection.setTimeout(confapp.timeout * 1000);
  }

  next();

};

exports.loadCompany = function(req, res, next) {
  var user = req.session? req.session.user : undefined;
  // Load company
  if(user && user.companyid && !user.company) {
    company.searchOne(user.companyid, function(err, result) {
      if(err)
        throw err;
      user.company = result._doc ? result._doc : result;
      next();
    });
  } else {
    next();
  }
}
