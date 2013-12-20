"use strict";

var fs        = smart.lang.fs
  , async     = smart.util.async
  , _         = smart.util.underscore
  , gridfs    = smart.ctrl.file
  , error     = smart.framework.errors
  , user      = smart.ctrl.user
  , auth      = smart.framework.auth
  , log       = smart.framework.log
  , file      = smart.ctrl.file
  , util      = smart.framework.util
  , tag       = require('./ctrl_tag')
  , filter      = require('../modules/mod_filter.js')



/**
 * 获取设备一览
 * @param start_
 * @param limit_
 * @param callback_
 */
exports.list = function (handler, callback_) {

  var code      = handler.params.code
    , start     = handler.params.start || 0
    , limit     = handler.params.count || 20
    , condition = {
      valid: 1
    };

  filter.total(code, function (err, count) {
    if (err) {
      return callback_(new error.InternalServer(err));
    }

    filter.getList(code, condition, start, limit, function (err, result) {

      if (err) {
        return callback_(new error.InternalServer(err));
      }
      return callback_(err, {totalItems: count, items: result});

    });
  });
};