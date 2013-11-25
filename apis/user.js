/**
 * @file 存取用户信息的controller
 * @author lizheng
 * @copyright Dreamarts Corporation. All Rights Reserved.
 */

"use strict";

var smart       = require("smartcore")
  , ctrlUser    = smart.ctrl.user
  , ctrlAclink  = smart.ctrl.aclink
  , auth        = smart.framework.auth
  , constant    = smart.framework.constant
  , context     = smart.framework.context
  , log         = smart.framework.log
  , response    = smart.framework.response
  , _           = smart.util.underscore;

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
      log.debug(err, undefined);
      log.audit("login failed.", req.query.name);
    } else {
      log.audit("login succeed.", result._id);
    }

    response.send(res, err, result);
  });
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

    if(params.permissions) {
      // 设置权限
      handler.addParams("type", "1");
      handler.addParams("main", result._id.toString());
      handler.addParams("subs", params.permissions);

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
  if (params.password !== "000000000000") {
    handler.addParams("password", auth.sha256(params.password));
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
    handler.addParams("type", "1");
    handler.addParams("main", result._id.toString());
    handler.addParams("subs", params.permissions);

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
      userData = {
        _id       : result._id,
        id        : result.userName,
        name      : result.first,
        birthday  : result.extend.birthday,
        sex       : result.extend.sex,
        entryDate : result.extend.entryDate,
        cellphone : result.extend.cellphone,
        remark    : result.extend.remark
      };

      // 获取权限
      handler.addParams("type", "1");
      handler.addParams("main", result._id.toString());
      ctrlAclink.get(handler, function(err, result) {

        if (err) {
          return response.send(res, err);
        }

        if(result) {
          userData.permissions = result.subs;
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

  handler.addParams("userName", handler.params.keyword);
  handler.addParams("realName", handler.params.keyword);
  handler.addParams("and", false);

  ctrlUser.getListByKeywords(handler, function(err, userResult) {

    if (err) {
      return response.send(res, err);
    }

    var users = [];
    var uids = [];
    _.each(userResult.items, function(user) {
      users.push({
        _id        : user._id,
        id         : user.userName,
        name       : user.first,
        birthday   : user.extend.birthday,
        sex        : user.extend.sex,
        entryDate  : user.extend.entryDate,
        cellphone  : user.extend.cellphone,
        remark     : user.extend.remark
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
              user.permissions = result[i].subs;
            }
          }
        });

        return response.send(res, err, { totalItems: userResult.totalItems, items: users });
      });
    } else {
      return response.send(res, err, { totalItems: userResult.totalItems, items: users });
    }

  });

};


















