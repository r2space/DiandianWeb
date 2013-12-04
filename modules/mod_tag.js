/**
 * Created with JetBrains WebStorm.
 * User: ZengXR
 * Date: 11/25/13
 * Time: 1:34 PM
 * To change this template use File | Settings | File Templates.
 */

"use strict";

var mongo       = smart.util.mongoose
  , conn        = smart.framework.connection
  , schema      = mongo.Schema;

/**
 * Tag集合
 * @type {schema}
 */
var Tag = new schema({
    scope    : { type: String, description: "Tag的有效范围" }
  , name     : { type: String, description: "Tag名称" }
  , counter  : { type: Number, description: "使用次数" }
  , valid    : { type: Number, description: "0: 无效 1: 有效", default: 1 }
  , editat   : { type: Date,   description: "修改时间", default: Date.now }
  , editby   : { type: String, description: "修改者" }
  , createat : { type: Date,   description: "创建时间", default: Date.now }
  , createby : { type: String, description: "创建者" }
});

/**
 * 使用定义好的Schema，生成Tag的model
 * @returns {*} Tag model
 */
function model(code) {

  return conn.model(code, "Tag", Tag);
}

/**
 * 添加一個Tag,計數器加一
 * @param code 编码
 * @param newTag 新标签
 * @param callback 返回添加结果
 */
exports.add = function (code, newTag, callback) {

  var Tag = model(code);
  var condition = { name: newTag.name };

  // 用名称检索，如有则计数器加一，否则新建
  Tag.findOne(condition, function(err, docs) {

    // increment
    if (docs) {
      Tag.update(condition, { $inc: {counter: 1} }, function(err, result) {
        return callback(err, result);
      });
    }

    // add a new tag
    else {
      var object = {
          scope    : newTag.scope
        , name     : newTag.name
        , counter  : 1
        , valid    : 1
        , editat   : new Date()
        , editby   : newTag.uid
        , createat : new Date()
        , createby : newTag.uid
      };

      new Tag(object).save(function (err, result) {
        return callback(err, result);
      });
    }
  });
};

/**
 * 删除一个tag（计数器减一）
 * @param code 编码
 * @param newTag 标签
 * @param callback 返回删除结果
 */
exports.remove = function (code, newTag, callback) {

  var tag = model(code);
  var condition = {
      scope: newTag.scope
    , name : newTag.name
  };

  tag.findOne(condition, function(err, docs) {

    // increment
    if (docs && docs.counter > 0) {
      tag.update(condition, { $inc: { counter: -1 } }, function(err, result) {
        return callback(err, result);
      });
    } else {
      return callback(err, docs);
    }
  });
};

/**
 * 获取Tag一览
 * @param code 编码
 * @param condition 条件
 * @param start 数据开始位置
 * @param limit 数据件数
 * @param callback 返回Tag一览
 */
exports.getList = function(code, condition, start, limit, callback) {

  var tag = model(code);

  tag.find(condition)
    .skip(start || 0)
    .limit(limit || 20)
    .sort({ counter: -1 })
    .exec(function(err, result){

      return callback(err, result);
    });
};
