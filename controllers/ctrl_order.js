/**
 * @file 存取订单信息的controllers
 * @author Sara(fyx1014@hotmail.com)
 * @copyright Dreamarts Corporation. All Rights Reserved.
 */

"use strict";


var _       = smart.util.underscore
  , async   = smart.util.async
  , error   = smart.framework.errors
  , seq       = require("../controllers/ctrl_seq.js")
  , order = require('../modules/mod_order.js')
  , item = require('../modules/mod_item.js')
  , desk = require('../modules/mod_desk.js')
  , service = require('../modules/mod_service.js');

exports.doneOrder = function(handler, callback) {
  var code = handler.params.code
    , orderId = handler.params.orderId
    , orderIds = handler.params.orderIds
  var ids = [];

  if(orderIds && orderIds.length >0 ){
    ids = orderIds.split(",");
  }

  if(orderId && orderId.length > 0) {
    ids.push(orderId);
  }
  var tmpResult = [];
  async.forEach(ids,function(idStr,cb){

    order.update(code,idStr,{ back: 1} ,function(err,orderResult){

      service.delUnfinishedCount(code,orderResult.serviceId,function(err,serviceResult){
        tmpResult.push(orderResult);
        cb(err,orderResult);
      });

    });

  },function(err,result){

    callback(err,tmpResult);

  })



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
    , type = handler.params.type
    , condition = {
        valid: 1
      , back : 0
    };

  var ids = [];
  if(orderIds && orderIds.length > 0  ){
    ids = orderIds.split(",");
  }

  if (ids && ids.length > 0) {
    condition._id = {$in: ids};
  }

  if(type == "item") {
    condition.itemType = { $in: [1] };
  } else {
    condition.itemType = { $in: [0,2] };
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


//, type          :  {type: Number, description: "类型 0:主食 1:菜品 2:酒水 10:广告", default: 1}
exports.getItemList = function(handler, callback) {
  var code = handler.params.code
    , type = handler.params.type
    , serviceId = handler.params.serviceId
    , condition = {
        valid: 1
        , back : 0
    };
  if(type == "item") {
    condition.itemType = {$in: [1]};
  } else {
    condition.itemType = {$in: [0,2]};
  }

  if (serviceId && serviceId.length >0){
    condition.serviceId = serviceId;
  }

  var start = 0 ;
  var limit = 100;

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
    var _back = back.split(",");

    condition.back = {$in : _back};

  }

  console.log(condition);

  order.total(code, condition, function (err, count) {
    if (err) {
      return callback(new error.InternalServer(err));
    }
    order.getList(code, condition, start, 1000, function (err, result) {
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



exports.addOrder = function(handler, callback) {
  var orderList = handler.params.orderList;
  var serviceId = handler.params.serviceId;
  var deskId = handler.params.deskId;
  var code = handler.params.code;

  for (var i in orderList) {
    orderList[i]._index = i
    console.log(orderList[i]);
  }

  var tmpResult = [];
  var tmpCurOrderNumSeq = "";
  seq.getNextVal(code,"orderNum" ,function(err,orderNumSeq){
    tmpCurOrderNumSeq = orderNumSeq;
    async.forEach(orderList, function (orderObj, cb) {
      seq.getNextVal(code,"orderSeq",function(err,seq){

        orderObj.orderSeq = seq;
        orderObj.orderNum = orderNumSeq;

          add(code,'', orderObj, function (err, docs) {
          tmpResult[orderObj._index] = docs;
          service.addUnfinishedCount(code,orderObj.serviceId,function(){

            cb(null, orderObj);
          });

        });
      });

    }, function (err, result) {
      console.log("deskId  :  " + deskId);
        if (!deskId){
          return  callback(err, {items:tmpResult , orderNum :tmpCurOrderNumSeq , deskName : "外卖", now: new Date()});
        }
        desk.get (code,deskId,function(err,deskObj) {
          callback(err, {items:tmpResult , orderNum :tmpCurOrderNumSeq , deskName : deskObj.name , now: new Date()});
        });

    });
  });

};

function add (code, uid, orderData, callback) {
  var now = new Date();

  var newOrder = {
      deskId      : orderData.deskId
    , serviceId   : orderData.serviceId
    , orderSeq    : orderData.orderSeq
    , orderNum    : orderData.orderNum
    , itemType    : orderData.itemType
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

exports.add = add;