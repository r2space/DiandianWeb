var smart  = require("smartcore")
  , json    = smart.core.json
  , errors  = smart.core.errors
  , desk    = require('../controllers/ctrl_desk');

// 获取一览
exports.list = function(req_, res_) {

  var start = req_.query.start
    , limit = req_.query.count
    , keyword = req_.query.keyword

  desk.list(start, limit, keyword , function(err, result) {
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

  desk.add(uid, req_.body, function(err, result) {
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

  desk.update(uid, req_.body, function(err, result) {
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

  desk.delete(uid, req_.body, function(err, result) {
    if (err) {
      return res_.send(err.code, json.errorSchema(err.code, err.message));
    } else {
      return res_.send(json.dataSchema(result));
    }
  });
};

