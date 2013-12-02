/**
 * Created with JetBrains WebStorm.
 * User: ZengXR
 * Date: 11/25/13
 * Time: 10:55 AM
 * To change this template use File | Settings | File Templates.
 */

var response  = smart.framework.response
  , errors    = smart.framework.errors
  , util      = smart.framework.util
  , context   = smart.framework.context
  , log       = smart.framework.log
  , device    = require("../controllers/ctrl_device");

// 获取设备一览
exports.list = function(req, res) {
  var handler = new context().bind(req, res);
  log.operation("begin: get device list.", handler.uid);

  device.list(handler, function(err, result) {
    log.operation("finish: get device list.", handler.uid);
    response.send(res, err, result);
  });
};

exports.deviceAllow = function(req, res) {
  var handler = new context().bind(req, res);
  log.operation("begin: allow an device.", handler.uid);

  device.deviceallow (handler, true, function(err, result) {
    log.operation("finish: allow an device.", handler.uid);
    response.send(res, err, result);
  });
}
exports.deviceDeny = function(req, res) {
  var handler = new context().bind(req, res);
  log.operation("begin: deny an device.", handler.uid);

  device.deviceallow (handler, false, function(err, result) {
    log.operation("finish: allow an device.", handler.uid);
    response.send(res, err, result);
  });
}
/**
 * 设置用户可用
 * @param req
 * @param res
 */
exports.allow = function(req, res) {
  var handler = new context().bind(req, res);
  log.operation("begin: allow an user.", handler.uid);

  device.allow (handler, true, function(err, result) {
    log.operation("finish: allow an user.", handler.uid);
    response.send(res, err, result);
  });
};
/**
 * 设置用户禁止
 * @param req_
 * @param res_
 */
exports.deny = function(req, res) {
  var handler = new context().bind(req, res);
  log.operation("begin: deny an user.", handler.uid);

  device.allow (handler, false, function(err, result) {
    log.operation("finish: deny an user.", handler.uid);
    response.send(res, err, result);
  });
};


///**
// * 添加设备+用户
// * 返回值
// *   status: 0 用户禁止使用该设备
// *   status: 1 使用中（承认）
// *   status: 2 使用申请中
// *   status: 3 未申请
// * @param req_
// * @param res_
// */
exports.add = function(req, res) {
  var handler = new context().bind(req, res);
  log.operation("begin: add an device.", handler.uid);

  device.add (handler, function(err, result) {
    log.operation("finish: add an device.", handler.uid);
    if (err) {
      return res.send(err.code, json.errorSchema(err.code, err.message));
    } else {
      return res.send(json.dataSchema(result));
    }
  });
};
exports.setDeviceUser = function(req_, res_){
  var deviceid = req_.query.deviceid
    , code = "diandian"
    , userid = req_.query.userid;
  device.setDeviceUser(code,userid,deviceid,function(err,result){
    response.send(res_, err, result);
  });

};

exports.deviceRegister = function(req, res) {
  var handler = new context().bind(req, res);
  log.operation("begin: register an device.", handler.uid);

  device.deviceRegister(handler, function(err, result) {
    log.operation("finish: register an device.", handler.uid);
    response.send(res, err, result);
  });
};
