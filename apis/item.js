var smart  = require("smartcore")
  , response    = smart.framework.response
  , errors  = smart.core.errors
  , item    = require("../controllers/ctrl_item");

// 获取一览
exports.list = function(req_, res_) {

  var code = req_.session.user.companycode
    , start = req_.query.start || 0
    , limit = req_.query.count || 20
    , keyword = req_.query.keyword
    , condition = {
      valid: 1
    };

  if (keyword) {
    keyword = util.quoteRegExp(keyword);
    condition.name = new RegExp(keyword.toLowerCase(), "i");
  }

  item.list(code, condition, start, limit , function(err, result) {
    response.send(res_, err, result);
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

  var code = req_.session.user.companycode
    , uid = req_.session.user._id;

  item.update(code, uid, req_.body, function(err, result) {
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

// 获取指定菜品
exports.findOne = function(req_, res_) {

  var code = req_.session.user.companycode
    , uid = req_.session.user._id
    , itemId = req_.query.itemId;

  item.get(code, uid, itemId, function(err, result) {
    console.log(result);
    response.send(res_, err, result);
  });
};

