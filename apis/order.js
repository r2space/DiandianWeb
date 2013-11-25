var code = "diandian";
var act   = require('../ws/action');
var order = require("../controllers/ctrl_order.js");
var seq = require("../controllers/ctrl_seq.js");
var service = require("../controllers/ctrl_service.js");
var async = require('async')
  , response = smart.framework.response


exports.list = function (req_, res_) {
  var code = "diandian"
    , deskId = req_.query.deskId
    , serviceId = req_.query.serviceId
    , start = req_.query.start
    , limit = req_.query.limit


  order.getList(code, deskId, serviceId, start, limit, function (err, result) {
    response.send(res_, err, result);
  });

}


exports.addOrder = function (data, callback) {
  var err = null;

  var tmpResult = [];
  var orderList = data.data.orderList;

  for (var i in orderList) {
    orderList[i]._index = i
  }


  seq.getNextVal(code,"orderNum" ,function(err,orderNumSeq){
    async.forEach(orderList, function (orderObj, cb) {
      seq.getNextVal(code,"orderSeq",function(err,seq){

        orderObj.orderSeq = seq;
        orderObj.orderNum = orderNumSeq;

        order.add(code,'', orderObj, function (err, docs) {
          tmpResult[orderObj._index] = docs;
          service.addUnfinishedCount(code,orderObj.serviceId,function(){
            cb(null, orderObj);
          });

        });
      });

    }, function (err, result) {

      callback(err, result,
        act.dataForwardBroadcast("newOrder",tmpResult)
      );

    });
  });

}