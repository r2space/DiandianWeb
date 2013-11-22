/**
 * @file 存取用户信息的controller
 * @author lizheng
 * @copyright Dreamarts Corporation. All Rights Reserved.
 */

"use strict";

var smart       = require("smartcore")
  , ctrlUser    = smart.ctrl.user
  , auth        = smart.framework.auth
  , context     = smart.framework.context
  , response    = smart.framework.response
  , _           = smart.util.underscore;

/**
 * 添加用户
 * @param req 请求对象
 * @param res 响应对象
 * @returns {*} 无
 */
exports.add = function(req, res) {

  req.query.password = auth.sha256(req.query.password);
  req.query.first = req.query.realName;
  req.query.email = "xxx@xxx.com";
  req.query.lang = "zh";
  req.query.timezone = "GMT+08:00";

  req.query.extend = {
      birthday  : req.query.birthday   // 出生日期
    , sex       : req.query.sex        // 性别
    , entryDate : req.query.entryDate  // 入职时间
    , cellphone : req.query.cellphone  // 手机号码
    , remark1   : req.query.remark1    // 备注1
    , remark2   : req.query.remark1    // 备注2
    , remark3   : req.query.remark1    // 备注3
  };

  var handler = new context().bind(req, res);

  ctrlUser.add(handler, function(err, result) {

    return response.send(res, err, {isSuccess: result ? true : false});
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

  if (req.query.password && req.query.password !== "000000000000") {
    req.query.password = auth.sha256(req.query.password);
  }
  req.query.first = req.query.realName;
  req.query.email = "xxx@xxx.com";
  req.query.lang = "zh";
  req.query.timezone = "GMT+08:00";

  req.query.extend = {
      birthday  : req.query.birthday   // 出生日期
    , sex       : req.query.sex        // 性别
    , entryDate : req.query.entryDate  // 入职时间
    , cellphone : req.query.cellphone  // 手机号码
    , remark1   : req.query.remark1    // 备注1
    , remark2   : req.query.remark1    // 备注2
    , remark3   : req.query.remark1    // 备注3
  };

  var handler = new context().bind(req, res);

  ctrlUser.update(handler, function(err, result) {

    return response.send(res, err, {isSuccess: result ? true : false});
  });

};

/**
 * 查询用户列表
 * @param req 请求对象
 * @param res 响应对象
 * @returns {*} 无
 */
exports.getList = function(req, res) {

  req.query.userName = req.query.keyword;
  req.query.first = req.query.keyword;
  req.query.and = false;

  var handler = new context().bind(req, res);

  ctrlUser.getListByKeywords(handler, function(err, result) {

    var list = [];
    if(result) {
      _.each(result.items, function(user) {
        list.push({
          _id        : user._id,
          userName   : user.userName,
          realName   : user.first,
          birthday   : user.extend.birthday,
          sex        : user.extend.sex,
          entryDate  : user.extend.entryDate,
          cellphone  : user.extend.cellphone,
          remark1    : user.extend.remark1,
          remark2    : user.extend.remark2,
          remark3    : user.extend.remark3
        });
      });
    }

    return response.send(res, err, result);
  });

};


















