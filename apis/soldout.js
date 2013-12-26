var response  = smart.framework.response
  , errors    = smart.framework.errors
  , util      = smart.framework.util
  , context   = smart.framework.context
  , log       = smart.framework.log
  , _         = require('underscore')
  , soldout    = require("../controllers/ctrl_soldout");

// 获取过滤一览
exports.list = function(req, res) {

  var handler = new context().bind(req, res);
  log.operation("begin: get soldout list.", handler.uid);

  soldout.list(handler, function(err, result) {

    log.operation("finish: get soldout list.", handler.uid);
    response.send(res, err, result);

  });

};


exports.add = function(req, res) {
  var handler = new context().bind(req, res);
  log.operation("begin: add soldout .", handler.uid);
  soldout.add(handler, function(err, result) {

    log.operation("finish: add soldout.", handler.uid);
    response.send(res, err, result);

  });
}

exports.remove = function(req, res) {
  var handler = new context().bind(req, res);
  log.operation("begin: add soldout .", handler.uid);
  soldout.remove(handler, function(err, result) {

    log.operation("finish: add soldout.", handler.uid);
    response.send(res, err, result);

  });
}

exports.removeAll = function(req, res) {
  var handler = new context().bind(req, res);
  log.operation("begin: removeAll soldout  .", handler.uid);
  soldout.removeAll(handler,function(err,result){
    log.operation("finish: removeAll.", handler.uid);
    response.send(res, err, result);
  });
}
