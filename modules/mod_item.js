/**
 * @file 存取菜品信息的module
 * @author xiangrui.zeng@gmail.com
 * @copyright Dreamarts Corporation. All Rights Reserved.
 */

"use strict";

var mongo       = require("mongoose")
  , smart       = require("smartcore").core.util
  , conn        = require("./connection")
  , schema      = mongo.Schema;

/**
 * 菜品的schema
 * @type {schema}
 */
var Item = new schema({
   fileid      : { type: String, description: "菜品ID" }
 , bigimage    : { type: String, description: "大图" }
 , smallimage  : { type: String, description: "小图" }
 , filename    : { type: String, description: "素材名" }
 , editat      : { type: Date,   description: "修改时间" }
 , editby      : { type: String, description: "修改者" }
 , chunkSize   : { type: Number, description: "素材大小" }
 , contentType : { type: String, description: "素材类型" }
 , tags        : [String]
});

/**
 * 使用定义好的Schema,通过Code生成Item的model
 * @param {string} code
 * @returns {model} item model
 */
function model(code) {

  return conn(code).model("Item", Material);
}

/**
 * 获取素材件数
 * @param {string} code 公司code
 * @param {object} conditions 条件
 * @param {function} callback 返回素材件数
 */
//TODO 和total函数重复,删除?
exports.count = function(code, conditions, callback) {

  var file = model(code);

  file.count(conditions, callback);
};

/**
 * 添加素材
 * @param {string} code 公司code
 * @param {object} newFile 素材
 * @param {function} callback 返回素材添加结果
 */
exports.add = function(code, newFile, callback) {

  var File = model(code);

  new File(newFile).save(function(err, result) {
    callback(err, result);
  });
};

/**
 * 更新指定素材
 * @param {string} code 公司code
 * @param {string} fileid 素材ID
 * @param {object} conditions 素材更新条件
 * @param {function} callback 返回素材更新结果
 */
exports.update = function(code, fileid, conditions, callback) {

  var file = model(code);

  file.findByIdAndUpdate(fileid, conditions, function(err, result) {
    callback(err, result);
  });
};

/**
 * 更新指定素材
 * @param {string} code 公司code
 * @param {string} fileid 素材ID
 * @param {object} conditions 素材更新条件
 * @param {function} callback 返回素材更新结果
 */
//TODO 和update方法重复,删除?
exports.replace = function(code, fileid, conditions, callback) {

  var file = model(code);

  file.findByIdAndUpdate(fileid, { $set: conditions }, function(err, result) {
    callback(err, result);
  });
};

/**
 * 获取指定素材
 * @param {string} code 公司code
 * @param {string} fileid 素材ID
 * @param {function} callback 返回指定素材
 */
exports.get = function(code, fileid, callback) {

  var file = model(code);

  file.findById(fileid, function(err, result) {
    callback(err, result);
  });
};


/**
 * 删除素材
 * @param {string} code 公司code
 * @param {string} fileid 素材ID
 * @param {function} callback 返回素材删除结果
 */
exports.remove = function(code, fileid, callback) {

  var file = model(code);

  file.findByIdAndRemove(fileid, function(err, result) {
    callback(err, result);
  });
};

/**
 * 获取素材一览
 * @param {string} code 公司code
 * @param {object} condition 条件
 * @param {number} start 数据开始位置
 * @param {number} limit 数据件数
 * @param {function} callback 返回素材一览
 */
exports.getList = function(code, condition, start, limit, callback) {

  var file = model(code);

  file.find(condition)
    .skip(start || 0)
    .limit(limit || 20)
    .sort({ editat: -1 })
    .exec(function(err, result) {
      callback(err, result);
    });
};

/**
 * 获取素材件数
 * @param {string} code 公司Code
 * @param {object} condition 条件
 * @param {function} callback 返回素材件数
 */
exports.total = function(code, condition, callback) {

  var file = model(code);

  file.count(condition).exec(function(err, count) {
    callback(err, count);
  });
};