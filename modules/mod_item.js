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
   itemName             : { type: String, description: "菜品名称" }
 , itemMethod           : { type: String, description: "菜品作法" }
 , smallimage           : { type: String, description: "小图" }
 , bigimage             : { type: String, description: "大图" }
 , itemPriceNormal      : { type: String, description: "正常价格" }
 , itemPriceHalf        : { type: String, description: "小份价格" }
 , itemPriceDiscount    : { type: String, description: "优惠价格" }
 , editat               : { type: Date,   description: "修改时间" }
 , editby               : { type: String, description: "修改者" }
 , itemComment          : { type: String, description: "菜品介绍" }
 , itemType             : { type: String, description: "菜品类型" }
 , itemMaterial         : { type: String, description: "菜品材料" }
 , valid                : {type: Number, description: "删除 0:无效 1:有效", default: 1}
 , tags                 : [String]
 , type                 :  {type: Number, description: "类型 0:主食 1:菜品 2:酒水 3:海鲜 10:广告", default: 1}
 , printerId            : { type: String, description: "打印机IP" }
 , pin                  : {type: [String], description: "类型 1:招牌菜 2:热卖中 3:新品菜 4:营养菜 5:优惠菜", default: null}
});

/**
 * 使用定义好的Schema,通过Code生成Item的model
 * @param {string} code
 * @returns {model} item model
 */
function model(dbname) {

  return conn.model(dbname, "Item", Item);
}

/**
 * 添加素材
 * @param {string} code 公司code
 * @param {object} newItem    新的菜品
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
 * @param {string} itemId菜品ID
 * @param {object} conditions 更新条件
 * @param {function} callback 返回菜品更新结果
 */
exports.update = function(code, itemId, newItem, callback) {

  var item = model(code);
  console.log(itemId)

  item.findByIdAndUpdate(itemId, newItem, function(err, result) {
    callback(err, result);
  });
};

/**
 * 获取指定菜品
 * @param {string} code 公司code
 * @param {string} itemId 菜品ID
 * @param {function} callback 返回指定菜品
 */
exports.get = function(code, itemId, callback) {
  var item = model(code);
  console.log(itemId)

  item.findOne({_id: itemId}, function(err, result) {
    callback(err, result);
  });
};


/**
 * 删除素材
 * @param {string} code  公司code
 * @param {string} itemId 菜品ID
 * @param {function} callback 返回删除结果
 */
exports.remove = function(code, uid, itemId, callback) {

  var item = model(code);


  item.findByIdAndUpdate(itemId,  {valid: 0, editat: new Date(), editby: uid}, function(err, result) {
    callback(err, result);
  });
};

/**
 * 获取素材一览
 * @param {string} code 公司code
 * @param {object} condition 条件
 * @param {number} start 数据开始位置
 * @param {number} limit 数据件数
 * @param {function} callback 返回一览
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
 * @param {function} callback 返回件数
 */
exports.total = function(code, condition, callback) {

  var item = model(code);

  item.count(condition).exec(function(err, count) {
    callback(err, count);
  });
};