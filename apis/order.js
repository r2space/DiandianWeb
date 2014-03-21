var response  = smart.framework.response
  , util      = smart.framework.util
  , async     = smart.util.async
  , errors    = smart.framework.errors
  , context   = smart.framework.context
  , log       = smart.framework.log
  , act       = require('../ws/action')
  , order     = require("../controllers/ctrl_order.js")
  , seq       = require("../controllers/ctrl_seq.js")
  , service   = require("../controllers/ctrl_service.js")
  , ws        = require('../ws/websocket')
  , act       = require('../ws/action');


var code = "diandian";

exports.wsRefresh = function (data, callback) {

  callback(null, "orderList");
}

exports.freeOrder = function (req,res) {
  var handler = new context().bind(req, res);
  log.operation("begin: get backOrder.", handler.uid);
  order.freeOrder(handler, function(err, result){
    log.operation("finish: get deskList.", handler.uid);

    ws.broadcast(act.dataBroadcast("refresh_desk", {deskId:handler.deskId}));
    ws.broadcast(act.dataBroadcast("refresh_order", {}));
    response.send(res, err, result);

  });
};

exports.backOrder = function (req,res) {
  var handler = new context().bind(req, res);
  log.operation("begin: get backOrder.", handler.uid);
  order.backOrder(handler, function(err, result){
    log.operation("finish: get deskList.", handler.uid);

    ws.broadcast(act.dataBroadcast("refresh_desk", {deskId:handler.deskId}));
    ws.broadcast(act.dataBroadcast("refresh_order", {}));
    response.send(res, err, result);

  });
};

exports.doneOrder = function (req,res) {
  var handler = new context().bind(req, res);
  log.operation("begin: get deskList.", handler.uid);
  order.doneOrder(handler, function(err, result){
    log.operation("finish: get deskList.", handler.uid);


    response.send(res, err, {items:result,totalItems:result.length});

  },function(err,result){
    ws.broadcast(act.dataBroadcast("refresh_desk", {}));
    ws.broadcast(act.dataBroadcast("refresh_order", {}));
  });
};

exports.doneOrderAndGetDishOrderList = function (req,res) {
  var handler = new context().bind(req, res);
  log.operation("begin: get deskList.", handler.uid);
  order.doneOrderAndGetDishOrderList(handler, function(err, result){
    log.operation("finish: get deskList.", handler.uid);


    response.send(res, err, result);

  },function(err,result){
    ws.broadcast(act.dataBroadcast("refresh_desk", {}));
    ws.broadcast(act.dataBroadcast("refresh_order", {}));
  });
};


exports.deskList = function (req,res) {
  var handler = new context().bind(req, res);
  log.operation("begin: get deskList.", handler.uid);

  order.getDeskList(handler, function(err, result) {

    log.operation("finish: get deskList.", handler.uid);
    response.send(res, err, result);

  });

};

exports.itemList = function (req, res) {
  var handler = new context().bind(req, res);
  log.operation("begin: get appfoodAndDrinkList.", handler.uid);
  order.getItemList(handler, function (err, result) {

    log.operation("finish: get appfoodAndDrinkList.", handler.uid);
    response.send(res, err, result);
  });

};

exports.dishItemList = function (req, res) {
  var handler = new context().bind(req, res);
  log.operation("begin: get appfoodAndDrinkList.", handler.uid);
  order.dishItemList(handler, function (err, result) {

    log.operation("finish: get appfoodAndDrinkList.", handler.uid);
    response.send(res, err, result);
  });

};

exports.appList = function (req_, res_) {
  var code = "diandian"
    , deskId = req_.query.deskId
    , serviceId = req_.query.serviceId
    , start = req_.query.start
    , limit = req_.query.limit
    , back = req_.query.back


  order.getList(code, deskId, serviceId,back ,start, limit, function (err, result) {
    response.send(res_, err, result);
  });

}

exports.orderAdd = function(req, res) {

  var handler = new context().bind(req, res);
  log.operation("begin: orderAdd  .", handler.uid);
  order.addOrder(handler,function(err,result) {

    ws.broadcast(act.dataBroadcast("refresh_desk", {}));
    ws.broadcast(act.dataBroadcast("refresh_order", {}));
    response.send(res, err, result);
  });
}

exports.addOrder = function (data, callback) {
  var err = null;

  var tmpResult = [];
  var orderList = data.data.orderList;
  var curDeskId = data.data.deskId;
  for (var i in orderList) {
    orderList[i]._index = i
    console.log(orderList[i]);
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
        act.dataForwardBroadcast("refreshOrder",{items:tmpResult}),
        act.dataBroadcast("refresh_desk", {deskId:curDeskId})
      );

    });
  });

}