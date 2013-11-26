var smart  = require("smartcore")
  , response    = smart.framework.response
  , errors  = smart.framework.errors
  , util    = smart.framework.util
  , item    = require("../controllers/ctrl_item");

// 获取一览
exports.list = function(req_, res_) {

  var code = "diandian"
    , start = req_.query.start || 0
    , limit = req_.query.count || 20
    , keyword = req_.query.keyword
    , condition = {
      valid: 1
    };

  if (keyword) {
    keyword = util.quoteRegExp(keyword);
    condition.itemName = new RegExp(keyword.toLowerCase(), "i");
  }

  item.list(code, condition, start, limit , function(err, result) {
    response.send(res_, err, result);
  });
};

// 添加
exports.add = function(req_, res_) {

  var code = "diandian"
    , uid = req_.session.user._id;

  item.add(code,uid, req_.body, function(err, result) {
    response.send(res_, err, result);
  });
};

// 更新
exports.update = function(req_, res_) {

  var code = "diandian"
    , uid = req_.session.user._id;

  item.add(code, uid, req_.body, function(err, result) {
    response.send(res_, err, result);
  });
};

// uploud image
exports.updateimage = function(req_, res_) {

  var code = "diandian"
    , uid = req_.session.user._id;

  // Get file list from the request
  var files = [];
  if (req_.files.files instanceof Array) {
    files = req_.files.files;
  } else {
    files.push(req_.files.files);
  }
  item.addimage(code, uid, files , function(err, result) {
    console.log(result);
    response.send(res_, err, result);
  });
};

// 删除·
exports.remove = function(req_, res_) {

  var code = req_.session.user.companycode
    , uid = req_.session.user._id;

  item.remove(code, uid, req_.body.id, function(err, result) {
    response.send(res_, err, result);
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

