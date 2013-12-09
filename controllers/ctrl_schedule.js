"use strict";

var _         = smart.util.underscore
  , async     = smart.util.async
  , error     = smart.framework.errors
  , util      = smart.framework.util
  , schedule      = require('../modules/mod_schedule.js');



exports.addSchedule = function(handler, callback) {
  var now = new Date()
    , uid = handler.uid
    , code = handler.code

  var newItem = {
        people : handler.params.people
      , phone  : handler.params.phone
      , time   : handler.params.time
      , desk   : handler.params.desk
      , valid  : 1
      , createat : now
      , createby : uid
      , editat   : now
      , editby   : uid
  }
  schedule.add(code,newItem,function(err,result){
    if(err || !result){

      var tmpError = {};
      tmpError._status = 300;
      tmpError._error = "添加失败";
      return callback(null,tmpError);

    }

    if(result){
      result._doc._status = 200;
    }
    callback(null,result);
  });

};



exports.getList = function(handler, callback) {
  var code = handler.params.code
    , start = handler.params.start || 0
    , limit = handler.params.count || 20
    , condition = { valid: 1 };


  schedule.total(code, condition, function (err, count) {

    schedule.getList(code, condition, start, limit,  function(err, result){
      if (err) {
        return callback(new error.InternalServer(err));
      }

      return callback(err, {items: result, totalItems: count});
    });
  });
};



exports.removeSchedule = function(handler, callback) {
  var code = handler.params.code
    , scheduleId = handler.params.scheduleId
    , uid = handler.uid;

  schedule.remove(code,uid,scheduleId,function(err,result){
    callback(err,result);
  });


};

