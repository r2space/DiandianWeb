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
  , soldout   = require('../modules/mod_soldout.js')

/**
 * 增加售罄
 *
 * @param callback_
 */
exports.add = function (handler, callback) {
  var code      = handler.params.code
    , itemId    = handler.params.itemId
    , now       = new Date();

  var obj = {
      itemId      : itemId
    , createat    : now
    , createby    : handler.uid
    , editat      : now
    , editby      : handler.uid
  };

  soldout.add(code,obj,function(err,soldout) {
    if(err) {
      return callback(err);
    }
    return callback(err,soldout);

  });
}

exports.remove = function (handler, callback) {
  var code      = handler.params.code
    , itemId    = handler.params.itemId


  soldout.remove(code,itemId,function(err,soldout){
    if(err){
      return callback(err);
    }
    return callback(err,soldout);

  });
}

/**
 * 获取售罄一览
 * @param handler
 * @param callback_
 */
exports.list = function (handler, callback_) {

  var code      = handler.params.code
    , start     = handler.params.start || 0
    , limit     = handler.params.count || 20
    , condition = {
      valid: 1
    };

  soldout.total(code,condition, function (err, count) {
    if (err) {
      return callback_(new error.InternalServer(err));
    }

    soldout.getList(code, condition, start, limit, function (err, result) {

      if (err) {
        return callback_(new error.InternalServer(err));
      }
      return callback_(err, {totalItems: count, items: result});

    });
  });
};


/**
 * 清空售罄
 *
 * @param callback_
 */
exports.removeAll = function (handler, callback) {
  var code      = handler.params.code

  soldout.removeAll(code,function(err,soldout){
    if(err){
      return callback(err);
    }
    return callback(err,soldout);

  });
}
