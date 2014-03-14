/**
 * Created by ZengXR on 12/12/13.
 */

var response  = smart.framework.response
  , errors    = smart.framework.errors
  , util      = smart.framework.util
  , context   = smart.framework.context
  , log       = smart.framework.log
  , printer   = require('../controllers/ctrl_printer');



// 获取一览
exports.list = function(req, res) {

  var handler = new context().bind(req, res);
  log.operation("begin: get printer list.", handler.uid);

  printer.list(handler, function(err, result) {
    log.operation("finish: get printer list.", handler.uid);
    response.send(res, err, result);
  });
};

// 添加
exports.add = function(req, res) {
  var handler = new context().bind(req, res);
  log.operation("begin: add an printer.", handler.uid);

  printer.add(handler, function(err, result) {
    log.operation("finish: add an printer.", handler.uid);
    response.send(res, err, result);
  });
};

// 更新
exports.update = function(req, res) {
  var handler = new context().bind(req, res);
  log.operation("begin: update an printer.", handler.uid);

  printer.update(handler, function(err, result) {
    log.operation("finish: update an printer.", handler.uid);
    response.send(res, err, result);
  });
};


// 删除·
exports.remove = function(req, res) {
  var handler = new context().bind(req, res);
  log.operation("begin: remove an printer.", handler.uid);

  printer.remove(handler, function(err, result) {
    log.operation("finish: remove an printer.", handler.uid);
    response.send(res, err, result);
  });
};

// 获取指定打印机
exports.findOne = function(req, res) {
  var handler = new context().bind(req, res);
  log.operation("begin: get an printer.", handler.uid);

  printer.get(handler, function(err, result) {
    log.operation("finish: get an printer.", handler.uid);
    response.send(res, err, result);
  });
};


// 申请加锁或者解锁打印机
exports.lock = function(req, res) {
  var handler = new context().bind(req, res);
  log.operation("begin: lock or unlock an printer.", handler.uid);

  printer.lock(handler, function(err, result) {
    log.operation("finish: lock or unlock get an printer.", handler.uid);
    response.send(res, err, result);
  });
};


