var smart  = require("smartcore")
  , response    = smart.framework.response
  , errors  = smart.core.errors
  , desk    = require('../controllers/ctrl_desk');

// 获取指定桌台
exports.findOne = function(req_, res_) {

  var code = req_.session.user.companycode
    , uid = req_.session.user._id
    , deskId = req_.query.deskId;

  desk.get(code, uid, deskId, function(err, result) {
    response.send(res, err, result);
  });
};

// 获取一览
exports.list = function(req_, res_) {

  var code = req_.session.user.companycode
    , start = req_.query.start
    , limit = req_.query.count
    , keyword = req_.query.keyword

  desk.list(code, start, limit, keyword , function(err, result) {
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

  desk.add(code, uid, req_.body, function(err, result) {
    if (err) {
      return res_.send(err.code, json.errorSchema(err.code, err.message));
    } else {
      return res_.send(json.dataSchema(result));
    }
  });
};

// 更新
exports.update = function(req_, res_) {

  var code = req_.session.user.companycode
    , uid = req_.session.user._id;

  desk.update(code, uid, req_.body, function(err, result) {
      if (err) {
          return res_.send(err.code, json.errorSchema(err.code, err.message));
      } else {
          return res_.send(json.dataSchema(result));
      }
  });
};

// 删除·
exports.remove = function(req_, res_) {

  var code = req_.session.user.companycode
    , uid = req_.session.user._id;

  desk.remove(code, uid, req_.body, function(err, result) {
    if (err) {
      return res_.send(err.code, json.errorSchema(err.code, err.message));
    } else {
      return res_.send(json.dataSchema(result));
    }
  });
};

