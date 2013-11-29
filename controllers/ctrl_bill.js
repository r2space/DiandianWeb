"use strict";

var _         = smart.util.underscore
  , async     = smart.util.async
  , error     = smart.framework.errors
  , util      = smart.framework.util
  , order      = require('../modules/mod_order.js')
  , desk      = require('../modules/mod_desk.js')
  , menu      = require('../modules/mod_menu.js')
  , item      = require('../modules/mod_item.js');

exports.createBill = function(handler, callback) {
  var code = handler.params.code
    , serviceId = handler.params.serviceId
    , deskId = handler.params.deskId
    , condition = { valid: 1 };

  var tmpAmount = 0 ;
  var tmpOrderList = [];

  order.getBillOrderList(code,condition,function(err,orderList){
    tmpOrderList = orderList;
    async.forEach(orderList,function(orderObj,cb){

      item.get(code,orderObj.itemId,function(err,itemObj){

        if (orderObj.type == 0){

          tmpAmount = tmpAmount + itemObj.itemPriceNormal;

        } else {

          tmpAmount = tmpAmount + itemObj.itemPriceHalf;

        }

        cb(null,itemObj);
      });

    } ,function(err,result){

      desk.get (code,deskId,function(err,deskObj) {

        callback( null, {desk:deskObj,items:tmpOrderList,amount:tmpAmount} );

      });

    });

  });

};