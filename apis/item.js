var smart  = require("smartcore")
  , json    = smart.core.json
  , errors  = smart.core.errors
  , item    = require("../controllers/ctrl_item");

// 获取一览
exports.list = function(req_, res_) {

  var start = req_.query.start
    , limit = req_.query.count
    , keyword = req_.query.keyword

  item.list(start, limit, keyword , function(err, result) {
    if (err) {
      return res_.send(err.code, json.errorSchema(err.code, err.message));
    } else {
      return res_.send(json.dataSchema(result));
    }
  });
};

// 添加
exports.add = function(req_, res_) {

  var uid = req_.session.user._id;

  item.add(uid, req_.item, function(err, result) {
    if (err) {
      return res_.send(err.code, json.errorSchema(err.code, err.message));
    } else {
      return res_.send(json.dataSchema(result));
    }
  });
};

// 更新
exports.update = function(req_, res_) {

  var uid = req_.session.user._id;

  item.update(uid, req_.item, function(err, result) {
    if (err) {
      return res_.send(err.code, json.errorSchema(err.code, err.message));
    } else {
      return res_.send(json.dataSchema(result));
    }
  });
};

// 删除·
exports.delete = function(req_, res_) {

  var uid = req_.session.user._id;

  item.delete(uid, req_.item, function(err, result) {
    if (err) {
      return res_.send(err.code, json.errorSchema(err.code, err.message));
    } else {
      return res_.send(json.dataSchema(result));
    }
  });
};

