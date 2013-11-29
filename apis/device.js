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
  , device      = require("../controllers/ctrl_device");

// 获取设备一览
exports.list = function(req_, res_) {

  var start = req_.query.start
    , limit = req_.query.count
    , code = "diandian";

  device.list(code, start, limit, function(err, result) {
    response.send(res_, err, result);
  });
};

//
exports.countcompanyid = function(req_, res_) {
  var code = "diandian";
  device.countcompanyid (code, req_, res_, function(err, result) {
    response.send(res_, err, result);
  });
};

exports.deviceAllow = function(req_, res_) {
  var uid = req_.session.user._id
    , devid = req_.body.device
    , code = "diandian"

  device.deviceallow (code, uid, devid, true, function(err, result) {
    response.send(res_, err, result);
  });
}
exports.deviceDeny = function(req_, res_) {
  var uid = req_.session.user._id
    , devid = req_.body.device
    , code = "diandian";

  device.deviceallow (code, uid, devid, false, function(err, result) {
    response.send(res_, err, result);
  });
}
/**
 * 设置用户可用
 * @param req_
 * @param res_
 */
exports.allow = function(req_, res_) {

  var uid = req_.session.user._id
    , devid = req_.body.device
    , userid = req_.body.user
    , code = "diandian";

 // device.setUserDefault(req_.session.user.lang,req_.session.user.timezone);
  device.allow (code, uid, devid, userid, true, function(err, result) {
    response.send(res_, err, result);
  });
};
/**
 * 设置用户禁止
 * @param req_
 * @param res_
 */
exports.deny = function(req_, res_) {

  var uid = req_.session.user._id
    , devid = req_.body.device
    , userid = req_.body.user
    , code = "diandian";

  device.allow (code, uid, devid, userid, false, function(err, result) {
    response.send(res_, err, result);
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
//exports.add = function(req_, res_) {
//
//  var description = req_.body.description
//    , devicetype = req_.body.devicetype
//    , deviceid = req_.body.deviceid
//    , user = req_.session.user
//    , confirm = req_.body.confirm
//    , code = req_.session.user.companycode;
//
//  device.add (code, deviceid, user, description, devicetype, confirm, function(err, result) {
//    if (err) {
//      return res_.send(err.code, json.errorSchema(err.code, err.message));
//    } else {
//      return res_.send(json.dataSchema(result));
//    }
//  });
//};
exports.setDeviceUser = function(req_, res_){
  var deviceid = req_.query.deviceid
    , code = "diandian"
    , userid = req_.query.userid;
  device.setDeviceUser(code,userid,deviceid,function(err,result){
    response.send(res_, err, result);
  });

};

exports.deviceRegister = function(req_, res_) {
  var deviceid = req_.query.deviceid
    , devicetoken = req_.query.token
    , code = "diandian"
    , devicetype = req_.query.devicetype
    , userid = req_.query.userid;
  if(!userid){
    response.send(res_, err, {status:"6009"});
  }
  if(!code){
    response.send(res_, err, {status:"6008"});
  }
  if(!deviceid){
    response.send(res_, err, {status:"6007"});
  }

  device.deviceRegister(deviceid,devicetoken, userid, code , devicetype , function(err, result) {
    response.send(res_, err, result);
  });
};
