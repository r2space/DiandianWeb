"use strict";
var ctrlUser    = smart.ctrl.user
var _         = smart.util.underscore
  , async     = smart.util.async
  , error     = smart.framework.errors
  , util      = smart.framework.util

  , order      = require('../modules/mod_order.js')
  , service      = require('../modules/mod_service.js')
  , desk      = require('../modules/mod_desk.js')
  , menu      = require('../modules/mod_menu.js')
  , item      = require('../modules/mod_item.js');
function MyParseFloat(price){
  var priceInt = parseInt(price);
  if(Number(priceInt) < Number(price)) {
    return priceInt + 1;
  } else {
    return Number(price);
  }
}
exports.stopBill = function(handler, callback) {
  var code      = handler.params.code
    , serviceId = handler.params.serviceId
    , amount    = handler.params.amount
    , profit    = handler.params.profit
    , agio      = handler.params.agio
    , preferential = handler.params.preferential;

  service.update(code,serviceId,{
    amount:amount ,
    profit:profit ,
    agio:agio ,
    preferential:preferential ,
    status : 3
  },function(err,result){
    callback( null, result);
  });

}

exports.createBill = function(handler, callback) {
  var code = handler.params.code
    , serviceId = handler.params.serviceId
    , condition = {
        valid: 1 ,
        serviceId :serviceId ,
        back :{
          $in:[0,1,2,3]
        }
    };

  var tmpAmount = 0 ;
  var tmpOrderList = [];
  service.get(code,serviceId,function(err,serviceResult){
    //service.get   start

    order.getBillOrderList(code,condition,function(err,orderList){
      tmpOrderList = orderList;
      for(var i in orderList){
        orderList[i]._doc._index = i;
      }
      async.forEach(orderList,function(orderObj,cb){

        item.get(code,orderObj.itemId,function(err,itemObj){
          var price = 0;
          if (orderObj.type == 0){
            price = parseInt(itemObj.itemPriceNormal);
          } else {
            price = parseInt(itemObj.itemPriceHalf);
          }

          var amount = orderObj.amount;


          //已上菜 + 为上菜 + （免单菜-免单菜) - 退菜
          if(orderObj.back == 0 || orderObj.back == 1 ||orderObj.back == 3) {

            //排除免单
            if(orderObj.back != 3)
              tmpAmount = MyParseFloat(tmpAmount) + MyParseFloat(orderObj.amountPrice);

          } else {

            tmpAmount = MyParseFloat(tmpAmount) - MyParseFloat(orderObj.amountPrice);
          }

          order.getList(code,{backOrderId:orderObj._id},0,100000,function(err,backOrderList){
            var totalBackAmount = 0

            if(backOrderList){

              for (var i in backOrderList) {
                totalBackAmount = totalBackAmount + Number(backOrderList[i].amount);
              }

            }
            orderObj._doc.totalBackAmount = totalBackAmount;
            orderObj[orderObj._doc._index] = itemObj;
            cb(null,orderObj);

          });


//          cb(null,itemObj);
        });

      } ,function(err,result){

        desk.get (code,serviceResult.deskId,function(err,deskObj) {
          if(!deskObj) {
            return callback( null, {desk:deskObj,items:tmpOrderList,amount:tmpAmount,profit:tmpAmount,waiter:"收银台"});
          }
          handler.addParams("uid",deskObj.createby);
          ctrlUser.get(handler,function(err,userObj){
            callback( null, {desk:deskObj,items:tmpOrderList,amount:tmpAmount,profit:tmpAmount,waiter:userObj.userName} );
          });


        });

      });

    });

  });


};
