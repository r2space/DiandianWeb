
"use strict";

var _           = require('underscore')
  , modService        = require('../modules/mod_service.js')
  , async       = require('async')
  , smart       = require("smartcore")
  , user        = smart.ctrl.user
  , group       = smart.ctrl.group
  , mod_group   = smart.mod.group
  , error       = smart.core.errors;

var mongo       = require("mongoose")
  , schema      = mongo.Schema
  , ObjectId    = schema.ObjectId;

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