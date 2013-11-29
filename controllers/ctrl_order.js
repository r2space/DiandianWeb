/**
 * @file 存取订单信息的controllers
 * @author Sara(fyx1014@hotmail.com)
 * @copyright Dreamarts Corporation. All Rights Reserved.
 */

"use strict";


var _       = smart.util.underscore
  , async   = smart.util.async
  , error   = smart.framework.errors
  , order = require('../modules/mod_order.js')
  , item = require('../modules/mod_item.js')
  , desk = require('../modules/mod_desk.js')
  , service = require('../modules/mod_service.js');

exports.doneOrder = function(handler, callback) {
  var code = handler.params.code
    , orderId = handler.params.orderId

  order.update(code,orderId,{ back: 1} ,function(err,result){

    service.delUnfinishedCount(code,result.serviceId,function(err,serviceResult){
      callback(err,result);
    });

  });


};

exports.backOrder = function(handler, callback) {
  var code = handler.params.code
    , orderIds = handler.params.orderIds
  var tmpResult = [];

  async.forEach(orderIds ,function(orderId,cb){

    order.update(code,orderId,{ back: 2} ,function(err,result){
      tmpResult.push(result);
      service.delUnfinishedCount(code,result.serviceId,function(err,serviceResult){
        cb(err,result);
      });

    });

  },function(err,result){
    callback(null,{items:tmpResult,totalItems:tmpResult.length});
  });


};

exports.getDeskList = function(handler, callback) {
  var code = handler.params.code
    , orderIds = handler.params.orderIds
    , condition = { valid: 1 };

  var ids = [];
  ids = orderIds.split(",");
  if (ids && ids.length > 0) {
    condition._id = {$in: ids};
  }

  order.total(code, condition, function (err, count) {
    if (err) {
      return callback(new error.InternalServer(err));
    }
    order.getList(code, condition, 0,50, function (err, result) {
      if (err) {
        return callback(new error.InternalServer(err));
      }
      getDeskListByOrderList(code,result,function(err,resultWithItem){
        return callback(err, {items: resultWithItem, totalItems: count});
      });

    });
  });

}


function getDeskListByOrderList (code,orderList,callback){
  var tempList = [];
  for(var i in orderList){
    orderList[i]._doc._index = i;
  }
  async.forEach(orderList, function(itemObj,cb){

    desk.get(code, itemObj.deskId,function(err,deskDocs){

      itemObj._doc.desk = deskDocs;
      tempList[itemObj._doc._index] = itemObj;
      cb(null,deskDocs);

    });

  } , function(err,result){
    callback(null,tempList);
  });
}




exports.getList = function (code, deskId, serviceId,back, start, limit, callback) {
  var condition = {
    valid: 1
  };

  if (deskId) {
    condition.deskId = deskId;
  }
  if (serviceId) {
    condition.serviceId = serviceId;
  }
  if (back){
    condition.back = back;
  }

  order.total(code, condition, function (err, count) {
    if (err) {
      return callback(new error.InternalServer(err));
    }
    order.getList(code, condition, start, limit, function (err, result) {
      if (err) {
        return callback(new error.InternalServer(err));
      }
      getItemListByOrderList(code,result,function(err,resultWithItem){
        return callback(err, {items: resultWithItem, totalItems: count});
      });

    });
  });

};


function getItemListByOrderList (code,orderList,callback){
  var tempList = [];
  for(var i in orderList){
    orderList[i]._doc._index = i;
  }
  async.forEach(orderList, function(itemObj,cb){

    item.get(code, itemObj.itemId,function(err,itemDocs){

      itemObj._doc.item = itemDocs;
      tempList[itemObj._doc._index] = itemObj;
      cb(null,itemDocs);

    });

  } , function(err,result){
    callback(null,tempList);
  });
}




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
    item.get(code, result.itemId,function(err,itemDocs){
      result._doc.item = itemDocs;
      callback(err, result);
    });

  });

};

