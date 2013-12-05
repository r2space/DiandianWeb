/**
 * @file 存取订单信息的module
 * @author lihao(h_li@dreamarts.co.jp)
 * @copyright Dreamarts Corporation. All Rights Reserved.
 */


"use strict";

var mongo       = smart.util.mongoose
  , conn        = smart.framework.connection
  , schema      = mongo.Schema;

/**
 * 订单
 * @type {schema}
 */
var Order = new schema({
    deskId          :   {type: String, description: "台位ID"}
  , serviceId       :   {type: String, description: "服务的Id"}
  , orderSeq        :   {type: String, description: "订单序号"}
  , orderNum        :   {type: String, description: "订单组"}
  , userId          :   {type: String, description: "服务员的Id"}
  , itemId          :   {type: String, description: "名称"}
  , itemType        :   {type: String, description: "类型 item 的类型"}
  , type            :   {type: Number, description: "类型 0 大份 1 小份", default: 0}
  , back            :   {type: Number, description: "类型 0:不退 1 已上菜  2:退菜", default: 0}
  , valid           :   {type: Number, description: "删除 0:无效 1:有效", default: 1}
  , remark          :   {type: String, description: "备注"}

  , createat        :   {type: Date,   description: "创建时间"}
  , createby        :   {type: String, description: "创建者"}
  , editat          :   {type: Date,   description: "最终修改时间"}
  , editby          :   {type: String, description: "最终修改者"}
});

/**
 * 使用定义好的Schema
 * @param {string} code
 * @returns {model} workstation model
 */
function model(code) {

  return conn.model(code, "Order", Order);
}


//追加

exports.add = function(code, newOrder, callback) {

  var order = model(code);

  new order(newOrder).save(function(err, result) {
    callback(err, result);
  });
};

exports.update = function(code ,orderId,newOrder, callback){

  var order = model(code);

  order.findByIdAndUpdate(orderId, newOrder, function(err, result) {
    callback(err, result);
  });

};

exports.total = function(code, condition, callback) {

  var order = model(code);

  order.count(condition).exec(function(err, count) {
    callback(err, count);
  });
};

exports.getOrderListByServiceId = function(code,serviceId,callback){
  var order = model(code);

  order.find({serviceId:serviceId},function(err,result){
    if(err){
      return callback(err);
    }

    if(!result){
      return callback(null,[]);
    }

    callback(null,result);
  });
}

exports.getList = function(code, condition, start, limit, callback) {

  var order = model(code);

  var sort = {};
  if(condition.serviceId){

    sort = {orderNum: 1,orderSeq:1};
  } else {

    sort = {createat : 1};
  }
  order.find(condition)
    .skip(start || 0)
    .limit(limit || 20)
    .sort(sort)
    .exec(function(err, result) {
      callback(err, result);
    });
};

exports.getBillOrderList = function(code,condition, callback){

  var order = model(code);
  order.find(condition).exec(function(err,result){
    callback(err, result);
  });

};
