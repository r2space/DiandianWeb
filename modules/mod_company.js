/**
 * @file 存取公司信息的module
 * @author r2space@gmail.com
 * @copyright Dreamarts Corporation. All Rights Reserved.
 */

"use strict";

var mongo       = smart.util.mongoose
  , smart       = smart.core.util
  , conn        = smart.framework.connection
  , schema      = mongo.Schema;

/**
 * 公司schema
 * @type {schema}
 */
var Company = new schema({
    code        : {type: String, description: "公司CODE"}
  , path        : {type: String, description: "登陆url用的path，对应顾客编集画面的公司ID"}
  , companyType : {type: String, description: "0:提案客户 1:委托客户 2:自营客户"}
  , mail        : {type: String, description: "管理员ID"}
  , name        : {type: String, description: "名称"}
  , kana        : {type: String, description: "假名"}
  , address     : {type: String, description: "地址"}
  , tel         : {type: String, description: "电话"}
  , active      : {type: Number, description: "0:无效 1:有效"}
  , valid       : {type: Number, description: "删除 0:无效 1:有效", default:1}
  , createat    : {type: Date,   description: "创建时间"}
  , createby    : {type: String, description: "创建者"}
  , editat      : {type: Date,   description: "最终修改时间"}
  , editby      : {type: String, description: "最终修改者"}
  });

/**
 * 使用定义好的Schema，生成Company的model
 * @returns {*} company model
 */
function model() {

  return conn().model(undefined, "Company", Company);
}

/**
 * 取得唯一的Code
 * @param callback
 */
function createCode(callback) {

  var comp = model()
    , guid8 = smart.randomGUID8();

  comp.count({ code: guid8 }).exec(function(err, count) {
    if (err) {
      return callback(err);
    }

    if (count > 0) {
      createCode(comp, callback);
    } else {
      return callback(err, guid8);
    }
  });
}

/**
 * 获取公司一览
 * @param condition 条件
 * @param start 数据开始位置
 * @param limit 数据件数
 * @param callback 返回公司一览
 */
exports.getList = function(condition, start, limit, callback){

  var comp = model();

  comp.find(condition)
    .skip(start || 0)
    .limit(limit || 20)
    .sort({ "editat": "desc" })
    .exec(function(err, result) {
      return callback(err, result);
    });
};

/**
 * 通过公司ID获取一个公司
 * @param path
 * @param callback
 */
exports.getByPath = function(path, callback) {

  var comp = model();

  comp.findOne({ path: path }, function(err, result) {
    return callback(err, result);
  });
};

/**
 * 通过公司Code获取一个公司
 * @param code
 * @param callback
 */
exports.getByCode = function(code, callback) {

  var comp = model();

  comp.findOne({ code: code }, function(err, result) {
    return callback(err, result);
  });
};

/**
 * 获取指定公司
 * @param compid
 * @param callback
 */
exports.get = function(compid, callback) {

  var comp = model();

  comp.findById(compid, function(err, result) {
    return callback(err, result);
  });
};

/**
 * 添加公司
 * @param newComp
 * @param callback
 */
exports.add = function(newComp, callback){

  createCode(function(err, code) {
    if (err) {
      return callback(err);
    }

    var Comp = model();
    newComp.code = code;

    new Comp(newComp).save(function(err, result){
      return callback(err, result);
    });
  });
};

/**
 * 更新指定公司
 * @param compid
 * @param newComp
 * @param callback
 */
exports.update = function(compid, newComp, callback) {

  // 当code存在
  if (newComp.code) {
    var comp = model();

    comp.findByIdAndUpdate(compid, newComp, function(err, result) {
      return callback(err, result);
    });
  }

  // 不存在Code里，追加生成一个 ---- 旧数据的修复。
  else {
    createCode(function(err, code){
      if (err) {
        return callback(err);
      }

      newComp.code = code;
      exports.update(compid, newComp, callback);
    });
  }
};

/**
 * 获取公司有效件数
 * @param condition
 * @param callback
 */
exports.total = function(condition, callback) {

  var comp = model();

  condition.valid = 1;
  comp.count(condition).exec(function(err, count) {
    return callback(err, count);
  });
};
