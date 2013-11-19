/**
 * @file 存取桌台信息的module
 * @author Sara(fyx1014@hotmail.com)
 * @copyright Dreamarts Corporation. All Rights Reserved.
 */

"use strict";

var mongo       = require("mongoose")
  , smart       = require("smartcore").core.util
  , conn        = require("./connection")
  , schema      = mongo.Schema;

/**
 * 公司schema
 * @type {schema}
 */
var Desk = new schema({
    name        : {type: String, description: "名称"}
  , type        : {type: Number, description: "类型 0:桌台 1:包间", default:0}
  , valid       : {type: Number, description: "删除 0:无效 1:有效", default:1}
  , createat    : {type: Date,   description: "创建时间"}
  , createby    : {type: String, description: "创建者"}
  , editat      : {type: Date,   description: "最终修改时间"}
  , editby      : {type: String, description: "最终修改者"}
  });

/**
 * 使用定义好的Schema,通过公司Code处理工作站数据
 * @param {string} dbname
 * @returns {model} workstation model
 */
function model(dbname) {

  return conn(dbname).model("Desk", Desk);
}

/**
 * 获取指定素材
 * @param {string} code 公司code
 * @param {string} deskId 桌台ID
 * @param {function} callback 返回指定桌台
 */
exports.get = function(code, deskId, callback) {

  var desk = model(code);

  desk.findOne({valid: 1, _id: deskId}, function(err, result) {
    callback(err, result);
  });
};

/**
 * 追加
 * @param {string} code 公司code
 * @param {object} newDesk 桌台
 * @param {function} callback 返回追加结果
 */
exports.add = function(code, newDesk, callback) {

  var Desk = model(code);

  new Desk(newDesk).save(function(err, result) {
    callback(err, result);
  });
};

/**
 * 更新
 * @param {string} code 公司code
 * @param {string} deskId 桌台ID
 * @param {object} newDesk 更新工作站的内容
 * @param {function} callback 返回更新结果
 */
exports.update = function(code, deskId, newDesk, callback) {

  var desk = model(code);

  desk.findByIdAndUpdate(deskId, newDesk, function(err, result) {
    callback(err, result);
  });
};

/**
 * 删除
 * @param {string} code 公司code
 * @param {string} uid  更新者ID
 * @param {string} deskId 桌台ID
 * @param {function} callback 返回删除结果
 */
exports.remove = function (code, uid, deskId, callback) {

  var desk = model(code);

  desk.findByIdAndUpdate(deskId, {valid: 0, editat: new Date(), editby: uid}, function(err, result) {
    callback(err, result);
  });
};

/**
 * 获取一览
 * @param {string} code 公司code
 * @param {object} condition 条件
 * @param {function} callback 返回桌台一览
 */
exports.getList = function(code, condition, callback) {

  var desk = model(code);

  desk.find(condition)
    .sort({sort_level: 1})
    .exec(function(err, result) {
      callback(err, result);
    });
};

/**
 * 获取工作站件数
 * @param {string} code 公司Code
 * @param {object} condition 条件
 * @param {function} callback 返回工作站件数
 */
exports.total = function(code, condition, callback) {

  var desk = model(code);

  desk.count(condition).exec(function(err, count) {
    callback(err, count);
  });
};