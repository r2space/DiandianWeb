/**
 * Created by ZengXR on 12/12/13.
 */

"use strict";

var error     = smart.framework.errors
  , log       = smart.framework.log
  , util      = smart.framework.util
  , printer   = require('../modules/mod_printer.js');

/**
 * 获取一览
 * @param start_
 * @param limit_
 * @param callback
 */
exports.list = function(handler, callback_) {
  var code      = handler.params.code
    , start     = handler.params.start || 0
    , limit     = handler.params.count || 20
    , keyword   = handler.params.keyword
    , condition = {
       valid : 1
    };

  if (keyword) {
    keyword = util.quoteRegExp(keyword);
    condition.printerName = new RegExp(keyword.toLowerCase(), "i");
  }

  printer.total(code, condition, function (err, count) {

    printer.getList(code, condition, start, limit,  function(err, result){
      if (err) {
        return callback_(new error.InternalServer(err));
      }

      return callback_(err, {items: result, totalItems: count});
    });
  });
};

exports.add = function(handler, callback){
  var now = new Date()
    , uid = handler.uid
    , code = handler.params.code

  var newPrinter = {
      name          : handler.params.name
    , printerIP     : handler.params.IP
    , type          : handler.params.type
    , editat: now
    , editby: handler.uid
  };

  newPrinter.createat = now;
  newPrinter.createby = handler.uid;

  printer.add(code, newPrinter, function(err, result){
    if (err) {
      return callback(new error.InternalServer(err));
    }

    callback(err, result);
  });
};


exports.update = function(handler, callback){
  var now = new Date()
    , uid = handler.uid
    , code = handler.params.code;

  var newPrinter = {
      name          : handler.params.name
    , printerIP     : handler.params.IP
    , type          : handler.params.type
    , editat: now
    , editby: uid
  };

  newPrinter.createat = now;
  newPrinter.createby = uid;

  printer.update(code, newPrinter, function(err, result){
    if (err) {
      return callback(new error.InternalServer(err));
    }

    callback (err, result)
  });
};


exports.remove = function(handler, callback){
  var uid = handler.uid
    , code = handler.code
    , printerId = handler.params.id;

  printer.remove(code, uid, printerId, function(err, result){
    if (err) {
      return callback(new error.InternalServer(err));
    }
    callback(err, result);
  });
};

exports.get = function(handler, callback){
  var uid = handler.uid
    , code = handler.code
    , printerId = handler.params.printerId;

  printer.get(code, printerId, function(err, result){
    if (err) {
      return callback(new error.InternalServer(err));
    }
    callback(err, result);
  });
};

