/**
 * @file 检查权限的controller
 * @author lizheng
 * @copyright Dreamarts Corporation. All Rights Reserved.
 */

"use strict";

var aclink      = smart.ctrl.aclink
  , context     = smart.framework.context
  , errors      = smart.framework.errors
  , response    = smart.framework.response
  , user        = require("../apis/user");

/**
 * 检查是否具有管理权限，有权限则执行callback，没有则返回异常
 * @param {Object} req 请求对象
 * @param {Object} res 响应对象
 * @returns {*} 无
 */
exports.checkAdmin = function(req, res, callback){

  var handler = new context().bind(req, res);

  handler.addParams("uid", req.session.user._id.toString());
  handler.addParams("permissions", [user.PERMISSION_ADMIN]);

  aclink.hasPermission(handler, function(err, exist) {
    if (err) {
      return response.send(res, err);
    }

    if(exist === true) {
      return callback();
    } else {
      return response.send(res, new errors.Unauthorized("No Permission."));
    }
  });
};

/**
 * 检查是否具有收银权限，有权限则执行callback，没有则返回异常
 * @param {Object} req 请求对象
 * @param {Object} res 响应对象
 * @returns {*} 无
 */
exports.checkCash = function(req, res, callback){

  var handler = new context().bind(req, res);

  handler.addParams("uid", req.session.user._id.toString());
  handler.addParams("permissions", [user.PERMISSION_CASH]);

  aclink.hasPermission(handler, function(err, exist) {
    if (err) {
      return response.send(res, err);
    }

    if(exist === true) {
      return callback();
    } else {
      return response.send(res, new errors.Unauthorized("No Permission."));
    }
  });
};

