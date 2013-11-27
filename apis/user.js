/**
 * @file 存储用户信息
 * @author r2space@gmail.com
 * @copyright Dreamarts Corporation. All Rights Reserved.
 */

"use strict";

var auth      = smart.framework.auth
  , response  = smart.framework.response
  , log       = smart.framework.log;

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

  log.debug("user name: " + req.query.name);
  response.send(res, null, result);
};
