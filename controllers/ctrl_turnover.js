"use strict";

var fs        = smart.lang.fs
  , async     = smart.util.async
  , _         = smart.util.underscore
  , moment    = smart.util.moment
  , gridfs    = smart.ctrl.file
  , error     = smart.framework.errors
  , user      = smart.ctrl.user
  , auth      = smart.framework.auth
  , log       = smart.framework.log
  , file      = smart.ctrl.file
  , util      = smart.framework.util
  , service  = require('../modules/mod_service.js')
  , desk  = require('../modules/mod_desk.js')
  , order  = require('../modules/mod_order.js');


/**
 * 获得 一天的营业额
 * @param {Object} handler 上下文对象
 * @param {Function} callback 返回菜品一览
 */
exports.list = function(handler, callback) {
  var code = handler.params.code
    , start = handler.params.start || 0
    , limit = handler.params.count || 20
    , keyword = handler.params.keyword
    , condition = {
      status : 3
    };

  var startTime = handler.params.startTime;
  var endTime   = handler.params.endTime;
  var startTimeDate = undefined;
  var endTimeDate = undefined;

  if(startTime) {
    startTimeDate = moment(startTime, ["YYYY-MM-DD"]);
    startTimeDate.set('hour', 0);
  }

  if(endTime) {
    endTimeDate = moment(endTime, ["YYYY-MM-DD"]);
    endTimeDate.set('hour', 23);
  }


  var nowstamp =  new Date();
  var startTimpstamp = new Date();
  var endTimestamp = new Date();

  if(!startTime) {
    startTimpstamp.setDate(nowstamp.getDate());	//设置 Date 对象中月的某一天 (1 ~ 31)。	1	3
    startTimpstamp.setMonth(nowstamp.getMonth());	//设置 Date 对象中月份 (0 ~ 11)。	1	3
    startTimpstamp.setFullYear(nowstamp.getFullYear());
    startTimpstamp.setHours(0);
    startTimpstamp.setMinutes(0);
    startTimpstamp.setSeconds(0);
    startTimpstamp.setMilliseconds(0);
  } else {
    startTimpstamp = startTimeDate.toDate();
  }

  if(!endTime) {
    endTimestamp.setDate(nowstamp.getDate());	//设置 Date 对象中月的某一天 (1 ~ 31)。	1	3
    endTimestamp.setMonth(nowstamp.getMonth());	//设置 Date 对象中月份 (0 ~ 11)。	1	3
    endTimestamp.setFullYear(nowstamp.getFullYear());
    endTimestamp.setHours(23);
    endTimestamp.setMinutes(0);
    endTimestamp.setSeconds(0);
    endTimestamp.setMilliseconds(0);
  } else {
    endTimestamp = endTimeDate.toDate();
  }

  condition.createat = {"$gte":startTimpstamp,"$lte":endTimestamp};
  if (keyword) {
    keyword = util.quoteRegExp(keyword);
    condition.name = new RegExp(keyword.toLowerCase(), "i");
  }

  var tmpResult = [];

  service.getList(code,condition,start,limit,function(err,result){
    for(var i in result){
      result[i]._index = i;
    }
    async.forEach(result,function(serviceObj,cb){

      async.waterfall([
        function(cb1){
          if(serviceObj.deskId){
            desk.get(code,serviceObj.deskId ,function(err,deskObj){
              serviceObj._doc.desk = deskObj;

              tmpResult[serviceObj._index] = serviceObj;
              cb1();
            });
          } else {
            tmpResult[serviceObj._index] = serviceObj;
            cb1();
          }
        },
        function(cb2){

         order.total(code,{serviceId:serviceObj._id,back:1},function(err,count){
           console.log(count);
           tmpResult[serviceObj._index]._doc.orderCount = count;
           cb2();
         });
        }
      ], function(err, result){
        return cb();
      });




    },function(err){
      service.total(code,condition,function(err,total){
        var amountCondition = {
           createat : {"$gte":startTimpstamp,"$lte":endTimestamp}
        };
        service.list(code,amountCondition,function(err,serviceList){
          var profitService = 0;
          for(var i in serviceList){
            console.log(serviceList[i].profit);
            if(serviceList[i].profit)
              profitService = parseInt(profitService) + parseInt(serviceList[i].profit);
          }
          return callback(err, {items: tmpResult,total:total,profit :profitService });
        });

      });

    });
  });

};