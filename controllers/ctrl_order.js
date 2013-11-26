/**
 * @file 存取订单信息的controllers
 * @author Sara(fyx1014@hotmail.com)
 * @copyright Dreamarts Corporation. All Rights Reserved.
 */

"use strict";

var _ = require('underscore')
  , order = require('../modules/mod_order.js')
  , service = require('../modules/mod_service.js')
  , async = require('async')
  , smart = require("smartcore")
  , error = smart.core.errors;



exports.getList = function (code, deskId, serviceId, start, limit, callback) {
  var condition = {
    valid: 1
  };

  if (deskId) {
    condition.deskId = deskId;
  }
  if (serviceId) {
    condition.serviceId = serviceId;
  }

  order.total(code, condition, function (err, count) {
    if (err) {
      return callback(new error.InternalServer(err));
    }
    order.getList(code, condition, start, limit, function (err, result) {
      if (err) {
        return callback(new error.InternalServer(err));
      }
      return callback(err, {items: result, totalItems: count});
    });
  });

};





exports.add = function (code, uid, orderData, callback) {
  var now = new Date();

  var newOrder = {
      deskId      : orderData.deskId
    , serviceId   : orderData.serviceId
    , orderSeq    : orderData.orderSeq
    , orderNum    : orderData.orderNum
    , userId      : orderData.userId
    , itemId      : orderData.itemId
    , type        : orderData.type
    , remark      : orderData.remark
    , createat    : now
    , createby    : uid
    , editat      : now
    , editby      : uid
  };

  order.add(code, newOrder, function (err, result) {
    if (err) {
      return callback(new error.InternalServer(err));
    }

    callback(err, result);
  });

};