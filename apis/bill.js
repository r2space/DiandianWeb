var response  = smart.framework.response
  , util      = smart.framework.util
  , errors    = smart.framework.errors
  , context   = smart.framework.context
  , log       = smart.framework.log
  , bill      = require('../controllers/ctrl_bill')
  , menu      = require('../controllers/ctrl_menu');
var  ws        = require('../ws/websocket')
  , act       = require('../ws/action');

exports.createBill = function(req, res) {


  var handler = new context().bind(req, res);
  log.operation("begin: createBill .", handler.uid);

  bill.createBill(handler, function(err, result) {

    log.operation("finish: createBill  .", handler.uid);
    ws.broadcast(act.dataBroadcast("refresh_desk", {deskId:"528c27f0daa33c0031000001"}));
    response.send(res, err, result);
  });

};

exports.stopBill = function(req, res) {

  var handler = new context().bind(req, res);

  log.operation("begin: stopBill .", handler.uid);

  bill.stopBill(handler, function(err, result) {

    log.operation("finish: stopBill  .", handler.uid);
    ws.broadcast(act.dataBroadcast("refresh_desk", {deskId:"528c27f0daa33c0031000001"}));
    response.send(res, err, result);

  });
};