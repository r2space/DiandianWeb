/**
 * Created with JetBrains WebStorm.
 * User: ZengXR
 * Date: 11/25/13
 * Time: 10:56 AM
 * To change this template use File | Settings | File Templates.
 */
"use strict";

var mongo       = smart.util.mongoose
  , conn        = smart.framework.connection
  , schema      = mongo.Schema;

/**
 * 设备schema
 * @type {schema}
 */
var Device = new schema({
    companycode    : { type: String, description: "公司编码" }
  , devicetoken    : { type: String, description: "ipad设备的 apn token" }
  , deviceuid      : { type: String, description: "正在使用的设备的用户ID" }
  , deviceid       : { type: String, description: "设备标识" }
  , deviceType     : { type: String, description: "设备类型" }
  , devstatus      : { type: String, description: "设备状态，1:使用中 0:使用不可" }
  , userinfo       : [{
      userid         : { type: String, description: "使用者ID" }
    , username       : { type: String, description: "使用者名" }
    , status         : { type: String, description: "状态，1:使用中 0:使用不可 2:申请中 3:未注册用户申请中" }
  }]
  , description    : { type: String, description: "申请描述" }
  , valid          : { type: Number, description: "删除 0:无效 1:有效", default:1 }
  , createat       : { type: Date,   description: "创建时间" }
  , createby       : { type: String, description: "创建者" }
  , editat         : { type: Date,   description: "最终修改时间" }
  , editby         : { type: String, description: "最终修改者" }
});

/**
 * 使用定义好的Schema，生成Device的model
 * @returns {*} device model
 */
function model(code) {
  return conn.model(code, "Device", Device);
}

/**
 * 获取设备有效件数
 * @param code 数据库标识
 * @param callback 返回设备有效件数
 */
exports.total = function(code, callback) {

  var Dev = model(code);

  Dev.count({valid:1}).exec(function(err, count) {
    callback(err, count);
  });
};

/**
 * 获取设备情报一览
 * @param code 数据库标识
 * @param condition 查询条件
 * @param start 数据开始位置
 * @param limit 数据件数
 * @param callback 返回设备情报一览
 */
exports.getListByPage = function(code, condition, start, limit, callback) {

  var Dev = model(code);

  Dev.find(condition)
    .skip(start || 0)
    .limit(limit || 15)
    .sort({deviceid: "desc"})
    .exec(function(err, result) {
      callback(err, result);
    });
};

/**
 * 添加设备
 * @param code 数据库标识
 * @param newDev 设备
 * @param callback 返回设备
 */
exports.add = function(code, newDev, callback) {

  var Dev = model(code);

  console.log("插入新设备 devicetoken ：" + newDev.devicetoken);

  new Dev(newDev).save(function(err, result) {
    callback(err, result);
  });
};

/**
 * 更新设备
 * @param code 数据库标识
 * @param docId 文档标识
 * @param newDev 设备
 * @param callback 返回更新后的设备
 */
exports.update = function(code, docId, newDev, callback) {

  var Dev = model(code);

  Dev.findByIdAndUpdate(docId, newDev, function(err, result) {
    callback(err, result);
  });
};

/**
 * 设置使用状态
 * @param code 数据库标识
 * @param uid 更新用户标识
 * @param device 设备
 * @param user 使用设备的用户
 * @param allow 是否允许使用设备，true|false
 * @param callback 返回更新后的设备
 */
exports.allow = function(code, uid, device, user, allow, callback) {

  var Dev = model(code);

  // 设备ID是唯一，所以不用加compid
  Dev.update({"deviceid": device, "userinfo.userid": user}, {
      $set: {"userinfo.$.status": allow ? "1" : "0"}
      , editat: new Date()
      , editby: uid
    }
    , function(err, result) {
      callback(err, result);
    });
};

/**
 * 检索设备
 * @param code 数据库标识
 * @param condition 查询条件
 * @param callback 返回设备一览
 */
exports.getList = function(code, condition, callback) {

  var Dev = model(code);

  Dev.find(condition).exec(function(err, result) {
    callback(err, result);
  });
};

/**
 * 查询指定公司下的设备数目
 * @param code 数据库标识
 * @param comId 公司标识
 * @param callback 返回设备数目
 */
exports.totalByComId = function(code, comId, callback) {
  var Dev = model(code);
  Dev.count({companyid : comId, valid : 1}).exec(function(err, count) {
    console.log(count);
    callback(err, count);
  });
};

/**
 * 查询并更新设备
 * @param code 数据库标识
 * @param query 查询条件
 * @param newDev 设备
 * @param callback 返回设备数目
 */
exports.getAndUpdate = function (code, query, newDev, callback) {
  var Dev = model(code);

  Dev.findOneAndUpdate(query, newDev, function(err, result) {
    callback(err, result);
  });
};
