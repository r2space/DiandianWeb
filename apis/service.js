
var response  = smart.framework.response
  , util      = smart.framework.util
  , errors    = smart.framework.errors
  , context   = smart.framework.context
  , log       = smart.framework.log

  , service   = require('../controllers/ctrl_service')
  , ws        = require('../ws/websocket')
  , act       = require('../ws/action');



exports.start = function(req, res) {

  var handler = new context().bind(req, res);
  log.operation("begin: service start.", handler.uid);


  service.startService(handler, function(err, result) {
    //if(err)
    ws.broadcast(act.dataBroadcast("refresh_desk", {deskId:""}));
    response.send(res, err, result);
  });

};

exports.changeDesk = function(req,res){

  var handler = new context().bind(req, res);
  log.operation("begin: changeDesk.", handler.uid);

  service.changeDesk(handler, function(err, result) {

    log.operation("finish: changeDesk.", handler.uid);
    response.send(res, err, result);
    setTimeout(function(){
      ws.broadcast(act.dataBroadcast("refresh_desk", {deskId:handler.deskId}));
    },1000);

  });

};

exports.takeoutList = function(req,res) {
  var handler = new context().bind(req, res);
  log.operation("begin: takeoutList.", handler.uid);
  service.getTakeoutList(handler, function(err, result) {

    log.operation("finish: takeoutList.", handler.uid);
    response.send(res, err, result);
  });

};