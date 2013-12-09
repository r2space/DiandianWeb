var response  = smart.framework.response
  , util      = smart.framework.util
  , async     = smart.util.async
  , errors    = smart.framework.errors
  , context   = smart.framework.context
  , log       = smart.framework.log
  , schedule      = require('../controllers/ctrl_schedule.js');



exports.addSchedule = function(req, res) {
  var handler = new context().bind(req, res);
  log.operation("begin: get addSchedule.", handler.uid);
  schedule.addSchedule(handler, function(err, result) {

    log.operation("finish: get menu list.", handler.uid);
    response.send(res, err, result);
  });

}

exports.getList = function(req, res){
  var handler = new context().bind(req, res);
  log.operation("begin:  getList.", handler.uid);
  schedule.getList(handler, function(err, result) {

    log.operation("finish: getList.", handler.uid);
    response.send(res, err, result);
  });
}

exports.removeSchedule = function(req, res){
  var handler = new context().bind(req, res);
  log.operation("begin:  removeSchedule.", handler.uid);
  schedule.removeSchedule(handler, function(err, result) {

    log.operation("finish: removeSchedule.", handler.uid);
    response.send(res, err, result);
  });
}