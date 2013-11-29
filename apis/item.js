var response  = smart.framework.response
  , errors    = smart.framework.errors
  , util      = smart.framework.util
  , context   = smart.framework.context
  , log       = smart.framework.log
  , _         = require('underscore')
  , item      = require("../controllers/ctrl_item");

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

  log.operation("begin: get menu list.", handler.uid);

  item.add(handler, function(err, result) {
    response.send(res, err, result);
  });
};

// 更新
exports.update = function(req, res) {
  var handler = new context().bind(req, res);

  item.update(handler, function(err, result) {
    response.send(res, err, result);
  });
};

// uploud image
exports.updateimage = function(req, res) {

  var handler = new context().bind(req, res);

  item.addimage(handler, function(err, result) {

    response.send(res, err, result);
  });
};

// 删除·
exports.remove = function(req, res) {

  var handler = new context().bind(req, res);

  item.remove(handler, function(err, result) {
    response.send(res, err, result);
  });
};

// 获取指定菜品
exports.findOne = function(req, res) {

  var handler = new context().bind(req, res);

  item.get(handler, function(err, result) {
    console.log(result);
    console.log("-----------------------------")
    response.send(res, err, result);
  });
};

