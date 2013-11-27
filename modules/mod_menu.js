/**
 * @file 存取桌台信息的module
 * @author Sara(fyx1014@hotmail.com)
 * @copyright Dreamarts Corporation. All Rights Reserved.
 */

"use strict";

var mongo       = smart.util.mongoose
  , conn        = smart.framework.connection
  , schema      = mongo.Schema;

/**
 * 公司schema
 * @type {schema}
 */
var Menu = new schema({
    name        : {type: String, description: "名称"}
  , comment     : {type: String, description: "介绍"}
  , page        : {type: Number, description: "页数"}
  , status      : {type: Number, description: "状态 0:保密 1:公开", default: 0}
  , items       : [{
        index   : {type: Number, description: "位置 1~9"}
      , itemId  : {type: String, description: "菜品ID"}
      , row      : {type: Number, description: "行数"}
      , column  : {type: Number, description: "列数"}
    }]
  , sortLevel   : {type: Number, description: "表示顺序", default: 10}
  , valid       : {type: Number, description: "删除 0:无效 1:有效", default: 1}
  , createat    : {type: Date,   description: "创建时间"}
  , createby    : {type: String, description: "创建者"}
  , editat      : {type: Date,   description: "最终修改时间"}
  , editby      : {type: String, description: "最终修改者"}
  });

/**
 * 使用定义好的Schema,通过公司Code处理工作站数据
 * @param {string} code
 * @returns {model} workstation model
 */
function model(code) {

  return conn.model(code, "Menu", Menu);
}

/**
 * 获取指定素材
 * @param {string} code 公司code
 * @param {string} menuId 桌台ID
 * @param {function} callback 返回指定桌台
 */
exports.get = function(code, menuId, callback) {

  var menu = model(code);

  menu.findOne({valid: 1, _id: menuId}, function(err, result) {
    callback(err, result);
  });
};

/**
 * 追加
 * @param {string} code 公司code
 * @param {object} newMenu 桌台
 * @param {function} callback 返回追加结果
 */
exports.add = function(code, newMenu, callback) {
  console.log(newMenu);
  var menu = model(code);

  new menu(newMenu).save(function(err, result) {
    callback(err, result);
  });
};

/**
 * 更新
 * @param {string} code 公司code
 * @param {string} menuId 桌台ID
 * @param {object} newMenu 更新工作站的内容
 * @param {function} callback 返回更新结果
 */
exports.update = function(code, menuId, newMenu, callback) {

  var menu = model(code);

  menu.findByIdAndUpdate(menuId, newMenu, function(err, result) {
    callback(err, result);
  });
};

/**
 * 删除
 * @param {string} code 公司code
 * @param {string} uid  更新者ID
 * @param {string} menuId 桌台ID
 * @param {function} callback 返回删除结果
 */
exports.remove = function (code, uid, menuId, callback) {

  var menu = model(code);

  menu.findByIdAndUpdate(menuId, {valid: 0, editat: new Date(), editby: uid}, function(err, result) {
    callback(err, result);
  });
};

/**
 * 获取一览
 * @param {string} code 公司code
 * @param {object} condition 条件
 * @param {function} callback 返回桌台一览
 */
exports.getList = function(code, condition, start, limit, callback) {

  var menu = model(code);

  menu.find(condition)
    .skip(start || 0)
    .limit(limit || 20)
    .sort({editat: -1})
    .exec(function(err, result) {
      callback(err, result);
    });
};

/**
 * 获取指定字段的一览
 * @param {string} code 公司code
 * @param {object} condition 条件
 * @param {function} callback 返回桌台一览
 */
exports.getPartialList = function(code, condition, field, callback) {

  var menu = model(code);

  menu.find(condition)
    .sort({editat: -1})
    .select(field)
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

  var menu = model(code);

  menu.count(condition).exec(function(err, count) {
    callback(err, count);
  });
};