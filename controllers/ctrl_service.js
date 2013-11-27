
"use strict";

var _           = smart.util.underscore
  , async       = smart.util.async
  , user        = smart.ctrl.user
  , group       = smart.ctrl.group
  , error       = smart.framework.errors
  , modService  = require('../modules/mod_service.js');

exports.startService = function(code,userId, deskId ,type,people,callback){
  var data = {
      deskId  : deskId || "-1"
    , people  : people || "1"
    , type    : type   || "1"
    , status :  type == "1" ? 1 : 0
    , unfinishedCount :   0
    , billNum         :   "10101"
    , orderNo         :   "10101"
    , createat        :   new Date()
    , createby        :   userId
    , editat          :   new Date()
    , editby          :   userId
  }
  modService.add(code,data,callback);

};

exports.addUnfinishedCount = function(code,serviceId,callback){
  modService.addUnfinishedCount(code,serviceId,callback);
};