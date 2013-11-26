/**
 * @file 存取菜品信息的module
 * @author xiangrui.zeng@gmail.com
 * @copyright Dreamarts Corporation. All Rights Reserved.
 */

"use strict";

var mongo       = smart.util.mongoose
  , conn        = smart.framework.connection
  , schema      = mongo.Schema;

/**
 * 菜品的schema
 * @type {schema}
 */
var Item = new schema({
   itemName      : { type: String, description: "菜品名称" }
 , itemMethod    : { type: String, description: "菜品作法" }
 , smallimage  : { type: String, description: "小图" }
 , bigimage  : { type: String, description: "大图" }
 , itemPriceNormal    : { type: String, description: "正常价格" }
 , itemPriceHalf    : { type: String, description: "小份价格" }
 , itemPriceDiscount    : { type: String, description: "优惠价格" }
 , editat      : { type: Date,   description: "修改时间" }
 , editby      : { type: String, description: "修改者" }
 , itemComment   : { type: String, description: "菜品介绍" }
 , itemType :  { type: String, description: "菜品类型" }
 , itemMaterial        : { type: String, description: "菜品材料" }
 , valid       : {type: Number, description: "删除 0:无效 1:有效", default: 1}
 , tags         : [String]
});

/**
 * 使用定义好的Schema,通过Code生成Item的model
 * @param {string} code
 * @returns {model} item model
 */
function model(dbname) {

  return conn(dbname).model("Item", Item);
}

/**
 * 获取素材件数
 * @param {string} code 公司code
 * @param {object} conditions 条件
 * @param {function} callback 返回素材件数
 */
//TODO 和total函数重复,删除?
//exports.count = function(code, conditions, callback) {
//
//  var file = model(code);
//
//  file.count(conditions, callback);
//};

/**
 * 添加素材
 * @param {string} code 公司code
 * @param {object} newFile 素材
 * @param {function} callback 返回素材添加结果
 */
exports.add = function(code, newItem, callback) {

  console.log(newItem);
  var item = model(code);

  new item(newItem).save(function(err, result) {
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
exports.update = function(code, itemId, newItem, callback) {

  var item = model(code);
  console.log(itemId)

  item.findByIdAndUpdate(itemId, newItem, function(err, result) {
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
exports.get = function(code, itemId, callback) {
  var item = model(code);


  item.findOne({_id: itemId}, function(err, result) {
    callback(err, result);
  });
};


/**
 * 删除素材
 * @param {string} code 公司code
 * @param {string} fileid 素材ID
 * @param {function} callback 返回素材删除结果
 */
exports.remove = function(code, uid, itemId, callback) {

  var item = model(code);

  item.findByIdAndRemove(itemId,  {valid: 0, editat: new Date(), editby: uid}, function(err, result) {
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

  var item = model(code);

  item.find(condition)
    .skip(start || 0)
    .limit(limit || 20)
    .sort({editat: -1})
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

  var item = model(code);

  item.count(condition).exec(function(err, count) {
    callback(err, count);
  });
};