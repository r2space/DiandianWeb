var response  = smart.framework.response
  , errors    = smart.framework.errors
  , util      = smart.framework.util
  , context   = smart.framework.context
  , log       = smart.framework.log
  , _         = smart.util.underscore
  , item      = require("../controllers/ctrl_item");

// 获取一览
exports.appList = function(req, res) {

  var handler = new context().bind(req, res);
  log.operation("begin: get item list.", handler.uid);

  item.appList(handler, function(err, result) {
    log.operation("finish: get item list.", handler.uid);
    response.send(res, err, result);
  });
};

// 获取一览
exports.list = function(req, res) {

  var handler = new context().bind(req, res);
  log.operation("begin: get item list.", handler.uid);

  item.list(handler, function(err, result) {
    log.operation("finish: get item list.", handler.uid);
    response.send(res, err, result);
  });
};

// 添加
exports.add = function(req, res) {
  var handler = new context().bind(req, res);
  log.operation("begin: add an item.", handler.uid);

  item.add(handler, function(err, result) {
    log.operation("finish: add an item.", handler.uid);
    response.send(res, err, result);
  });
};

// 更新
exports.update = function(req, res) {
  var handler = new context().bind(req, res);
  log.operation("begin: update an item.", handler.uid);

  item.update(handler, function(err, result) {
    log.operation("finish: update an item.", handler.uid);
    response.send(res, err, result);
  });
};

// uploud image
exports.updateimage = function(req, res) {
  var handler = new context().bind(req, res);
  log.operation("begin: upload an item.", handler.uid);

  item.addimage(handler, function(err, result) {
    log.operation("finish: upload an item.", handler.uid);
    response.send(res, err, result);
  });
};

// 删除·
exports.remove = function(req, res) {
  var handler = new context().bind(req, res);
  log.operation("begin: remove an item.", handler.uid);

  item.remove(handler, function(err, result) {
    log.operation("finish: remove an item.", handler.uid);
    response.send(res, err, result);
  });
};

// 获取指定菜品
exports.findOne = function(req, res) {
  var handler = new context().bind(req, res);
  log.operation("begin: get an item.", handler.uid);

  item.get(handler, function(err, result) {
    log.operation("finish: get an item.", handler.uid);
    response.send(res, err, result);
  });
};

