/**
 * @file 存储用户信息
 * @author r2space@gmail.com
 * @copyright Dreamarts Corporation. All Rights Reserved.
 */

"use strict";

var ctrlUser    = smart.ctrl.user
  , ctrlAclink  = smart.ctrl.aclink
  , auth        = smart.framework.auth
  , constant    = smart.framework.constant
  , context     = smart.framework.context
  , log         = smart.framework.log
  , response    = smart.framework.response
  , _           = smart.util.underscore;

var FAKE_PASSWORD = "0000000000000000";

function hasPermission(permissions, pcode) {
  if(permissions) {
    for(var i = 0; i < permissions.length; i++) {
      if(permissions[i] === pcode) {
        return true;
      }
    }
  }

  return false;
}

exports.PERMISSION_ADMIN = "1";
exports.PERMISSION_CASH = "2";

/**
 * 简易登陆实现
 * @param {Object} req 请求对象
 * @param {Object} res 响应对象
 * @returns {*} 无
 */
exports.simpleLogin = function(req, res){

  log.debug("user name: " + req.query.name);

  // パスワードのsha256文字列を取得する
  req.query.password = auth.sha256(req.query.password);

  // 認証処理
  auth.simpleLogin(req, res, function(err, result) {

    if (err) {
      log.error(err, undefined);
      log.audit("login failed.", req.query.name);
    } else {
      log.audit("login succeed.", result._id);
    }

    response.send(res, err, result);
  });
};

/**
 * TODO: 添加内容
 * @param {Object} req 请求对象
 * @param {Object} res 响应对象
 * @returns {*} 无
 */
exports.simpleLogout = function(req, res){

  // TODO
  res.render("login", {"title": "login"});
};

/**
 * 添加用户
 * @param req 请求对象
 * @param res 响应对象
 * @returns {*} 无
 */
exports.add = function(req, res) {

  var handler = new context().bind(req, res);

  var params = handler.params;

  handler.addParams("userName", params.id);
  handler.addParams("password", auth.sha256(params.password));
  handler.addParams("first", params.name);
  handler.addParams("email", "xxx@xxx.com");
  handler.addParams("lang", "zh");
  handler.addParams("timezone", "GMT+08:00");
  handler.addParams("extend", {
    birthday  : params.birthday   // 出生日期
    , sex       : params.sex        // 性别
    , entryDate : params.entryDate  // 入职时间
    , cellphone : params.cellphone  // 手机号码
    , remark    : params.remark    // 备注
  });

  ctrlUser.add(handler, function(err, result) {

    if (err) {
      return response.send(res, err);
    }

    if(params.admin || params.cash) {
      // 设置权限
      handler.addParams("type", constant.ACLINK_TYPE_USER_PERMISSION);
      handler.addParams("main", result._id.toString());
      var subs = [];
      if(params.admin) {
        subs.push(exports.PERMISSION_ADMIN);
      }
      if(params.cash) {
        subs.push(exports.PERMISSION_CASH);
      }
      handler.addParams("subs", subs);

      ctrlAclink.add(handler, function(err, result) {
        return response.send(res, err, {isSuccess: result ? true : false});
      });
    } else {
      return response.send(res, err, {isSuccess: result ? true : false});
    }
  });

};

/**
 * 删除用户
 * @param req 请求对象
 * @param res 响应对象
 * @returns {*} 无
 */
exports.remove = function(req, res) {

  var handler = new context().bind(req, res);
  handler.addParams("uid", handler.params.userId);

  ctrlUser.remove(handler, function(err, result) {

    return response.send(res, err, {isSuccess: result ? true : false});
  });

};

/**
 * 更新用户
 * @param req 请求对象
 * @param res 响应对象
 * @returns {*} 无
 */
exports.update = function(req, res) {

  var handler = new context().bind(req, res);

  var params = handler.params;

  handler.addParams("uid", params.userId);
  if (params.password !== FAKE_PASSWORD) {
    handler.addParams("password", auth.sha256(params.password));
  } else {
    handler.removeParams("password");
  }
  handler.addParams("first", params.name);
  handler.addParams("extend", {
    birthday  : params.birthday   // 出生日期
    , sex       : params.sex        // 性别
    , entryDate : params.entryDate  // 入职时间
    , cellphone : params.cellphone  // 手机号码
    , remark    : params.remark    // 备注
  });

  ctrlUser.update(handler, function(err, result) {

    if (err) {
      return response.send(res, err);
    }

    // 更新权限
    handler.addParams("type", constant.ACLINK_TYPE_USER_PERMISSION);
    handler.addParams("main", result._id.toString());
    var subs = [];
    if(params.admin === true) {
      subs.push(exports.PERMISSION_ADMIN);
    }
    if(params.cash === true) {
      subs.push(exports.PERMISSION_CASH);
    }
    handler.addParams("subs", subs);

    ctrlAclink.update(handler, function(err, result) {
      return response.send(res, err, {isSuccess: result ? true : false});
    });
  });

};

/**
 * 查询用户
 * @param req 请求对象
 * @param res 响应对象
 * @returns {*} 无
 */
exports.get = function(req, res) {

  var handler = new context().bind(req, res);
  handler.addParams("uid", handler.params.userId);

  ctrlUser.get(handler, function(err, result) {

    if (err) {
      return response.send(res, err);
    }

    var userData;
    if(result) {

      result.extend = result.extend ? result.extend : {};

      userData = {
        _id       : result._id
        , id        : result.userName
        , password  : FAKE_PASSWORD
        , name      : result.first
        , birthday  : result.extend.birthday
        , sex       : result.extend.sex
        , entryDate : result.extend.entryDate
        , cellphone : result.extend.cellphone
        , remark    : result.extend.remark
      };

      // 获取权限
      handler.addParams("type", constant.ACLINK_TYPE_USER_PERMISSION);
      handler.addParams("main", result._id.toString());
      ctrlAclink.get(handler, function(err, result) {

        if (err) {
          return response.send(res, err);
        }

        if(result) {
          userData.admin = hasPermission(result.subs, exports.PERMISSION_ADMIN);
          userData.cash = hasPermission(result.subs, exports.PERMISSION_CASH);
        }

        return response.send(res, err, userData);
      });
    } else {
      return response.send(res, err);
    }
  });

};

/**
 * 查询用户列表
 * @param req 请求对象
 * @param res 响应对象
 * @returns {*} 无
 */
exports.getList = function(req, res) {

  var handler = new context().bind(req, res);

  var keyword = handler.params.keyword;

  var condition = {
    "$or": [{
      "userName": new RegExp(keyword, "i")
    }, {
      "first": new RegExp(keyword, "i")
    }]
  };

  handler.addParams("condition", condition);

  ctrlUser.getList(handler, function(err, userResult) {

    if (err) {
      return response.send(res, err);
    }

    var users = [];
    var uids = [];
    _.each(userResult.items, function(user) {

      user.extend = user.extend ? user.extend : {};

      users.push({
        _id        : user._id
        , id         : user.userName
        , name       : user.first
        , birthday   : user.extend.birthday
        , sex        : user.extend.sex
        , entryDate  : user.extend.entryDate
        , cellphone  : user.extend.cellphone
        , remark     : user.extend.remark
      });

      uids.push(user._id.toString());
    });

    if(uids.length > 0) {
      // 关联权限
      handler.addParams("condition", {
        type: constant.ACLINK_TYPE_USER_PERMISSION
        , main: {$in: uids}
      });

      ctrlAclink.getList(handler, function(err, result) {
        if (err) {
          return response.send(res, err);
        }

        _.each(users, function(user) {
          for(var i = 0; i < result.length; i++) {
            if(result[i].main === user._id.toString()) {
              user.admin = hasPermission(result[i].subs, exports.PERMISSION_ADMIN);
              user.cash = hasPermission(result[i].subs, exports.PERMISSION_CASH);
            }
          }
        });

        return response.send(res, err, { totalItems: userResult.totalItems, items: users });
      });
    } else {
      return response.send(res, err, { totalItems: 0, items: [] });
    }

  });

};

/**
 * 修改密码（for Web）
 * @param req 请求对象
 * @param res 响应对象
 * @returns {*} 无
 */
exports.updatePassword = function(req, res) {

  var handler = new context().bind(req, res);

  var name = handler.params.id;
  var oldPassword = handler.params.oldPassword;
  var newPassword = handler.params.newPassword;

  handler.addParams("name", name);
  handler.addParams("password", auth.sha256(oldPassword));

  ctrlUser.isPasswordRight(handler, function(err, result) {

    if (err) {
      return response.send(res, err);
    }

    handler.addParams("password", auth.sha256(newPassword));

    ctrlUser.update(handler, function(err, result) {
      return response.send(res, err, {isSuccess: result ? true : false});
    });

  });
};

/**
 * 修改图形密码（for iPad）
 * @param req 请求对象
 * @param res 响应对象
 * @returns {*} 无
 */
exports.updatePattern = function(req, res) {

  var handler = new context().bind(req, res);

  handler.addParams("extendKey", "pattern");
  handler.addParams("extendValue", handler.params.pattern);

  ctrlUser.updateExtendProperty(handler, function(err, result) {
    return response.send(res, err, {isSuccess: result ? true : false});
  });
};

/**
 * 检查图形密码是否正确（for iPad）
 * @param req 请求对象
 * @param res 响应对象
 * @returns {*} 无
 */
exports.isPatternRight = function(req, res) {

  var handler = new context().bind(req, res);

  ctrlUser.get(handler, function(err, result) {

    if (err) {
      return response.send(res, err);
    }

    if (!result.extend || !result.extend.pattern) {
      return response.send(res, err, {isRight: -1});
    }

    return response.send(res, err, {isRight: (result.extend.pattern === handler.params.pattern)});
  });
};












