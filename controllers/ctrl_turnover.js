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
  , order  = require('../modules/mod_order.js')
  , mod_item  = require('../modules/mod_item.js');

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
    endTimestamp.setMinutes(59);
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
  console.log("start :"  + start);

  console.log("limit :"  + limit);

  service.getTurnoverList(code,condition,start,limit,function(err,result){

    if(err){
      return callback(err,result);
    }
    async.each(result,function(doc,cb){

      async.parallel({
        deskObj:function(subcb){
          //外卖没有桌台
          if(doc.deskId == -1){
            subcb(null,null);
          }else{
            desk.get(code,doc.deskId ,function(err,desk_doc){
              subcb(err,desk_doc);
            });
          }
        },
        orderCount:function(subcb){
          order.total(code,{serviceId:doc._id,back:1},function(err,count){
            subcb(err,count);
          });
        }
      },function(err,result){
          if(err){
            cb(err);
          }else{
            doc._doc.desk = result.deskObj;
            doc._doc.orderCount = result.orderCount;
            cb(err);
          }
      });

    },function(err){
      if(err){
        return callback(err,null);
      }else{
        service.total(code,condition,function(err,total){
          if(err){
            return callback(err,null);
          }
          service.list(code,condition,function(err,itmes){
            if(err){
              return callback(err,null);
            }
            var profitTotal = 0;
            _.each(itmes, function(item){
              profitTotal += parseInt(item.profit);
            });
            return callback(err, {items: result,total:total,profit :profitTotal});
          });
        });
      }
    });
  });
};
exports.get = function(handler, callback){

  var code = handler.code
    , params = handler.params
    , sid = params.sid;

  service.get(code,sid,function(err,doc){
    if(err){
      return callback(err);
    }
    order.getOrderListByServiceId(code,sid,function(err,orders){
      if(err){
        return callback(err);
      }
      async.each(orders,function(order,cb){
        mod_item.get(code,order.itemId,function(err,item){
          if(!err){
            order._doc.item = item;
          }
          return cb(err);
        });

      },function(err){
        if(err){
          return callback(err);
        }
        doc._doc.orders = orders;
        return callback(err,doc);
      });
    });
  });
};


exports.analytics = function(handler,callback) {

  var params = handler.params
    ,code = params.code
    ,saleType = params.saleType
    ,backType = params.backType;

  var condition = {status : 3};
  condition.createat = getDateRange(handler);

  var salesRanking = {};
  var backRanking = {};

  service.getTurnoverList(code, condition, 0, Number.MAX_VALUE, function (err, result) {

    if(err){
      return callback(err,result);
    }
    async.each(result,function(service,cb){
      order.getOrderListByServiceId(code,service._id,function(err,orders){
        if(err){
          return cb(err);
        }
        _.each(orders,function(item){


          if(item.back == 2){

            if(item.itemType == backType){
              if(! _.has(backRanking,item.itemId)){
                backRanking[item.itemId] = 0;
              }
              backRanking[item.itemId] += parseInt(item.amount);
            }

          }else{

            if(item.itemType == saleType){

              if(! _.has(salesRanking,item.itemId)){
                salesRanking[item.itemId] = 0;
              }
              salesRanking[item.itemId]+= parseInt(item.amount);
            }
          }
        });
        cb(null);

      });
    },function(err){
      if(err){
        return callback(err);
      }else{

        async.parallel({
          saleRanking: function(subcb){
            var topSaleItem = [];
            var topSaleResult = [];
            _.each(_.sortBy(_.pairs(salesRanking),function(kv){return kv[1] * -1;}),function(kv){
              if(topSaleItem.length < 20){
                topSaleItem.push(kv[0]);
              }
            });

            async.eachSeries(topSaleItem, function(item,cb){
              mod_item.get(code,item,function(err,orderDoc){
                if(err){
                  return cb(err);
                }
                orderDoc._doc.saleCount = salesRanking[orderDoc._id];
                topSaleResult.push(orderDoc);
                cb(null);
              });
            },function(err){
              if(err){
                return subcb(err);
              }else{
                return subcb(err,topSaleResult);
              }
            });
          },
          backRanking: function(subcb){
            var topBackItem = [];
            var topBackResult = [];
            _.each(_.sortBy(_.pairs(backRanking),function(kv){return kv[1] * -1;}),function(kv){
              if(topBackItem.length < 20){
                topBackItem.push(kv[0]);
              }
            });

            async.eachSeries(topBackItem, function(item,cb){
              mod_item.get(code,item,function(err,orderDoc){
                if(err){
                  return cb(err);
                }
                orderDoc._doc.backCount = backRanking[orderDoc._id];
                topBackResult.push(orderDoc);
                cb(null);
              });
            },function(err){
              if(err){
                return subcb(err);
              }else{
                return subcb(err,topBackResult);
              }
            });
          }
        },
        function(err, result) {

            if(err){
              return callback(err);
            }else{
              return callback(err,result);
            }

        });
      }
    });
  });
};

function getDateRange(handler) {
  var startTime = handler.params.startTime;
  var endTime = handler.params.endTime;
  var startTimeDate = undefined;
  var endTimeDate = undefined;

  if (startTime) {
    startTimeDate = moment(startTime, ["YYYY-MM-DD"]);
    startTimeDate.set('hour', 0);
  }

  if (endTime) {
    endTimeDate = moment(endTime, ["YYYY-MM-DD"]);
    endTimeDate.set('hour', 23);
  }


  var nowstamp = new Date();
  var startTimpstamp = new Date();
  var endTimestamp = new Date();

  if (!startTime) {
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

  if (!endTime) {
    endTimestamp.setDate(nowstamp.getDate());	//设置 Date 对象中月的某一天 (1 ~ 31)。	1	3
    endTimestamp.setMonth(nowstamp.getMonth());	//设置 Date 对象中月份 (0 ~ 11)。	1	3
    endTimestamp.setFullYear(nowstamp.getFullYear());
    endTimestamp.setHours(23);
    endTimestamp.setMinutes(59);
    endTimestamp.setSeconds(0);
    endTimestamp.setMilliseconds(0);
  } else {
    endTimestamp = endTimeDate.toDate();
  }
  return {"$gte": startTimpstamp, "$lte": endTimestamp}
};

