
"use strict";

var _           = smart.util.underscore
  , async       = smart.util.async
  , user        = smart.ctrl.user
  , group       = smart.ctrl.group
  , error       = smart.framework.errors
  , service  = require('../modules/mod_service.js')
  , order  = require('../modules/mod_order.js');

exports.startService = function(handler, callback) {
  var code = handler.params.code;

  var params = handler.params
    , userId = params.userId;

  var data = {
      deskId  : params.deskId || "-1"
    , people  : params.people || "1"
    , type    : params.type   || "1"
    , phone   : params.phone || "0"
    , status          :   1
    , unfinishedCount :   0
    , createat        :   new Date()
    , createby        :   userId
    , editat          :   new Date()
    , editby          :   userId
  };

  // 检查台位的状态
  checkService(code,params.deskId,function(err,check){
    //如果开台类型判断桌子情况
    if (params.type == 1){
      if(check && check.length > 0 ) {
        if(check[0].status == 1){
          var tmpError = {};
          tmpError._status  = 300;
          tmpError._error   = "已经开台";
          callback(err,tmpError)
          return;
        }
      }
    }

    service.add(code,data,function(err,result){

      result._doc._status  = 200;
      callback(err,result)
    });
  });


};

function checkService(code,deskId,callback){
  service.checkStatus(code,deskId,callback);
}

exports.changeDesk = function(handler, callback) {
  var code = handler.params.code
    , serviceId = handler.params.serviceId
    , deskId = handler.params.deskId

  service.update(code,serviceId,{deskId:deskId+""},function(err,result){

    updateOrderDeskId(code,serviceId,deskId,function(){
      callback(err,result);
    })

  });


};

function updateOrderDeskId (code,serviceId,deskId,callback){
  order.getOrderListByServiceId(code,serviceId,function(err,orderList){
     async.forEach(orderList,function(orderObj,cb){
       order.update(code,orderObj._id,{deskId:deskId+""},function(err,result){
         cb(null,result);
       });
     },function(err,result){
       callback(err,"1");
     })
  });
}


exports.getTakeoutList = function(handler, callback) {
  var code = handler.params.code
    , condition = {
        type : 3
      , status : 1
    };

  service.total(code, condition, function (err, count) {

    service.getTakeoutList(code,condition,0,100,function(err,result){
      console.log(result);
      callback(err,{items: result, totalItems:count});

    });

  });


}



exports.addUnfinishedCount = function(code,serviceId,callback){
  service.addUnfinishedCount(code,serviceId,callback);
};