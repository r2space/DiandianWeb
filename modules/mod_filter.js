

/**
 * @file 存取已上完菜的信息的module
 * @author xiangrui.zeng@gmail.com
 * @copyright Dreamarts Corporation. All Rights Reserved.
 */

"use strict";

var mongo       = smart.util.mongoose
  , conn        = smart.framework.connection
  , schema      = mongo.Schema;

/**
 * 过滤菜品已上完信息的表
 * @type {schema}
 */
var Filter = new schema({
    itemId               : { type: String, description: "菜品名称" }
  , valid       : {type: Number, description: "删除 0:无效 1:有效", default: 1}
  , createat    : {type: Date,   description: "创建时间"}
  , createby    : {type: String, description: "创建者"}
  , editat      : {type: Date,   description: "最终修改时间"}
  , editby      : {type: String, description: "最终修改者"}
});


function model(code) {
  return conn.model(code, "Filter", Filter);
}

exports.getList = function(code, condition, start, limit, callback) {

  var filter = model(code);

  filter.find(condition)
    .skip(start || 0)
    .limit(limit || 20)
    .exec(function(err, result) {
      callback(err, result);
    });
};

exports.total = function(code, condition, callback) {

  var filter = model(code);

  filter.count(condition).exec(function(err, count) {
    callback(err, count);
  });

};

exports.remove = function (code, uid, filterId, callback) {

  var filter = model(code);

  filter.findByIdAndUpdate(filterId, {valid: 0, editat: new Date(), editby: uid}, function(err, result) {
    callback(err, result);
  });

};

exports.add = function(code, newFilter, callback) {

  var filter = model(code);

  new filter(newFilter).save(function(err, result) {

    callback(err, result);
  });

};
