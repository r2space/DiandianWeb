
"use strict";

var _           = smart.util.underscore
  , async       = smart.util.async
  , user        = smart.ctrl.user
  , group       = smart.ctrl.group
  , error       = smart.framework.errors
  , service  = require('../modules/mod_service.js');

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

  service.add(code,data,callback);

};

exports.changeDesk = function(handler, callback) {
  var code = handler.params.code
    , serviceId = handler.params.serviceId
    , deskId = handler.params.deskId

  service.update(code,serviceId,{deskId:deskId},function(err,result){

    callback(err,result);

  });


};

exports.getTakeoutList = function(handler, callback) {
  var code = handler.params.code
    , condition = {
      type : 3
    };

  service.total(code, condition, function (err, count) {

    service.getList(code,condition,function(err,result){
      console.log(result);
      callback(err,{items: result, totalItems:count});

    });

  });


}



exports.addUnfinishedCount = function(code,serviceId,callback){
  service.addUnfinishedCount(code,serviceId,callback);
};