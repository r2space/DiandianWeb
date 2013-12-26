

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
var Soldout = new schema({
  itemId        : { type: String, description: "菜品名称" }
  , valid       : {type: Number, description: "删除 0:无效 1:有效", default: 1}
  , createat    : {type: Date,   description: "创建时间"}
  , createby    : {type: String, description: "创建者"}
  , editat      : {type: Date,   description: "最终修改时间"}
  , editby      : {type: String, description: "最终修改者"}
});


function model(code) {
  return conn.model(code, "Soldout", Soldout);
}

exports.getList = function(code, condition, start, limit, callback) {

  var soldout = model(code);

  soldout.find(condition)
    .skip(start || 0)
    .exec(function(err, result) {
      callback(err, result);
    });
};

exports.total = function(code, condition, callback) {

  var soldout = model(code);

  soldout.count(condition).exec(function(err, count) {
    callback(err, count);
  });

};

exports.remove = function (code, itemId, callback) {

  var soldout = model(code);

  soldout.remove({itemId:itemId}, function(err, result) {
    callback(err, result);
  });

};

exports.add = function(code, newSoldout, callback) {

  var soldout = model(code);

  new soldout(newSoldout).save(function(err, result) {

    callback(err, result);
  });

};

exports.removeAll = function(code,callback){
  var soldout = model(code);
  soldout.remove({},function(err,result){
    callback(err,result);
  });

}