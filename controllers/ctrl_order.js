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

/**
 * 上菜机能 可以传入数组 或者  单独的OrderId
 * @param handler
 * @param callback
 */
exports.doneOrder = function(handler, callback,sokcet) {
  var code = handler.params.code
    , orderId = handler.params.orderId
    , orderIds = handler.params.orderIds
  var ids = [];

  //当传入数组的时候 123,123,123  用","分割字符串。
  if(orderIds && orderIds.length >0 ){
    ids = orderIds.split(",");
  }
  //传入当个Order的Id
  if(orderId && orderId.length > 0) {
    ids.push(orderId);
  }
  var tmpResult = [];
  async.forEach(ids,function(idStr,cb) {

    order.get(code,idStr,function(err,orderDocs){
      if(err){
        return cb(null,null);
      }
      if(!orderDocs){

        return cb(null,null);
      }
      //读取 Order 判断是否存在 back ＝＝ 1  防止重复上菜
      if(orderDocs){
        if(orderDocs.back == 1){

              tmpResult.push(orderDocs);
              cb(err,orderDocs);

        } else {

          var snow = new Date().getTime();
          order.update(code,idStr,{ back: 1 ,editby:handler.uid} ,function(err,orderResult){
            var enow = new Date().getTime();
            var wait = snow - enow;
            setTimeout(function(){


              order.get(code,idStr,function(err,orderDocs1){
                if(orderDocs1.back == 1 && orderDocs1.editby == handler.uid){
                  service.delUnfinishedCount(code,orderDocs1.serviceId,function(err,serviceResult) {
                    console.log("delete  ok");
                    sokcet(null,"ok");
                  });
                } else {
                  sokcet(null,"ok");
                }


              });
              console.log("timeou");

            },wait+1000);

            tmpResult.push(orderResult);
            cb(err,orderResult);


          });
        }
      }

    });


  },function(err,result){

    callback(err,tmpResult);

  })



};


/**
 * 免单
 * @param handler
 * @param callback
 */


exports.freeOrder = function(handler, callback) {
  var code = handler.params.code
    , orderIds = handler.params.orderIds
  var tmpResult = [];

  async.forEach(orderIds ,function(orderId,cb){

    order.update(code,orderId,{ back: 3} ,function(err,result){
      tmpResult.push(result);
        cb(err,result);
    });

  },function(err,result){
    callback(null,{items:tmpResult,totalItems:tmpResult.length});
  });


};


//_id : ""
//wileBackAmount :""
function MyParseFloat(price){
  var priceInt = parseInt(price);
  if(Number(priceInt) < Number(price)) {
    return priceInt + 1;
  } else {
    return Number(price);
  }
}


exports.backOrder = function(handler, callback) {
  var code = handler.params.code
    , backOrderList = handler.params.backOrderList
  var tmpResult = [];

  async.forEach(backOrderList ,function(backOrderObj,cb) {

    order.get(code,backOrderObj.orderId,function(err,orderDocs) {

      var amount = orderDocs.amount;


      var now = new Date();
      var newBackOrder = {
          deskId      : orderDocs.deskId
        , serviceId   : orderDocs.serviceId
        , orderSeq    : orderDocs.orderSeq
        , orderNum    : orderDocs.orderNum
        , userId      : orderDocs.userId
        , itemType    : orderDocs.itemType
        , type        : orderDocs.type
        , itemId      : orderDocs.itemId
        , itemPrice   : orderDocs.itemPrice
        , amountPrice : orderDocs.amountPrice
        , amount      : orderDocs.amount
        , back        : 2
        , createat    : now
        , createby    : handler.uid
        , editat      : now
        , editby      : handler.uid

      };

      newBackOrder.amount = backOrderObj.willBackAmount;
      newBackOrder.backOrderId = backOrderObj.orderId;

      var amountPrice = MyParseFloat(Number(backOrderObj.willBackAmount) * Number(orderDocs.itemPrice));
      newBackOrder.amountPrice = amountPrice +""



      add(code,'', newBackOrder, function (err, newBackOrderDocs) {
          order.update(code,backOrderObj.orderId,{ back: 1,hasBack:1} ,function(err,result){
            service.delUnfinishedCount(code,result.serviceId,function(err,serviceResult){
              tmpResult.push(newBackOrderDocs);
              cb(err,null);
            });
          });
      });



    });


  },function(err,result){
    callback(null,{ok:""});
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
    condition.itemType = { $in: [1,3] };
  } else {
    condition.itemType = { $in: [0,2] };
  }

  order.total(code, condition, function (err, count) {
    if (err) {
      return callback(new error.InternalServer(err));
    }
    order.getList(code, condition, 0,50,null, function (err, result) {
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


//, type :  {type: Number, description: "类型 0:主食 1:菜品 2:酒水 10:广告", default: 1}
exports.getItemList = function(handler, callback) {
  var code = handler.params.code
    , type = handler.params.type
    , serviceId = handler.params.serviceId
    , condition = {
        valid: 1
        , back : 0
    };
  if(type == "item") {
    condition.itemType = {$in: [1,3]};
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
    order.getList(code, condition, start, limit,null, function (err, result) {
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

  if (back) {
    var _back = back.split(",");
    condition.back = {$in : _back};
  }



  order.total(code, condition, function (err, count) {
    if (err) {
      return callback(new error.InternalServer(err));
    }
    order.getList(code, condition, start, 1000,{itemType :1}, function (err, result) {
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

      order.getList(code,{backOrderId:itemObj._id},0,100000,null,function(err,backOrderList){
        var totalBackAmount = 0
        if(backOrderList){

          for (var i in backOrderList) {
            totalBackAmount = totalBackAmount + Number(backOrderList[i].amount);
          }
        }
        itemObj._doc.totalBackAmount = totalBackAmount;
        desk.get(code,itemObj.deskId,function(err,deskDocs){

          itemObj._doc.desk = deskDocs;
          tempList[itemObj._doc._index] = itemObj;
          cb(null,itemDocs);
        });


      });


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
              serviceId = orderObj.serviceId;
              cb(null, orderObj);


          });
      });

    }, function (err, result) {
        if (!deskId){
          service.addUnfinishedCount(code,serviceId,orderList.length,function(){
            return callback(err, {items:tmpResult , orderNum :tmpCurOrderNumSeq , deskName : "外卖", now: new Date()});
          });
          return;
        }
        desk.get (code,deskId,function(err,deskObj) {
          service.addUnfinishedCount(code,serviceId,orderList.length,function(){
            callback(err, {items:tmpResult , orderNum :tmpCurOrderNumSeq , deskName : deskObj.name , now: new Date()});
          });
        });

    });
  });

};

function add (code, uid, orderData, callback) {
  var now = new Date();

  var newOrder = {
      deskId      : orderData.deskId
    , serviceId   : orderData.serviceId
    , backOrderId : orderData.backOrderId?orderData.backOrderId:""
    , orderSeq    : orderData.orderSeq
    , orderNum    : orderData.orderNum
    , userId      : orderData.userId
    , itemId      : orderData.itemId
    , remark      : orderData.remark
    , type        : orderData.type
    , back        : orderData.back ? orderData.back : 0
    , createat    : now
    , createby    : uid
    , editat      : now
    , editby      : uid
    , amount      : orderData.amount
  };



  item.get(code, orderData.itemId, function (err1, itemDocs) {
    if (err1) {
      return callback(new error.InternalServer(err1));
    }

    var price;
    if (orderData.type == "0") {
      //大份
      price = itemDocs.itemPriceNormal;
    } else {
      //小份
      price = itemDocs.itemPriceHalf;
    }

    newOrder.itemType = itemDocs.type;
    newOrder.type = orderData.type;
    newOrder.itemPrice = price;
    newOrder.discount = itemDocs.discount?itemDocs.discount:0;

    var amountPirce = MyParseFloat(parseFloat(price) * parseFloat(orderData.amount));
    newOrder.amountPrice = amountPirce+"";

      order.add(code, newOrder, function (err, result) {
      if (err) {
        return callback(new error.InternalServer(err));
      }

      if (itemDocs)
        result._doc.item = itemDocs;

      callback(err, result);
    });


  });
};

exports.add = add;