var smart  = require("smartcore")
  , response    = smart.framework.response
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

  var code = req_.session.user.companycode
    , uid = req_.session.user._id;

  item.add(code,uid, req_.body, function(err, result) {
    response.send(res_, err, result);
  });
};

// 更新
exports.update = function(req_, res_) {

  var uid = req_.session.user._id;

  item.update(uid, req_.body, function(err, result) {
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

  item.delete(uid, req_.body, function(err, result) {
    if (err) {
      return res_.send(err.code, json.errorSchema(err.code, err.message));
    } else {
      return res_.send(json.dataSchema(result));
    }
  });
};

