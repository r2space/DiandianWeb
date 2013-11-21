/**
 * @file 存取订单信息的module
 * @author lihao(h_li@dreamarts.co.jp)
 * @copyright Dreamarts Corporation. All Rights Reserved.
 */


"use strict";

var mongo       = require("mongoose")
  , conn        = require("./connection")
  , schema      = mongo.Schema;

/**
 * 订单
 * @type {schema}
 */
var Order = new schema({
    deskId          :   {type: String, description: "台位ID"}
  , billId          :   {type: String, description: "结账ID"}
  , orderGroup      :   {type: String, description: "订单组"}
  , people          :   {type: Number, description: "人数"}
  , user            :   {type: String, description: "类型 0:不退 1:退菜", default: 0}
  , item            :   {type: String, description: "名称"}
  , type            :   {type: Number, description: "类型 0:桌台 1:包间", default: 0}
  , back            :   {type: Number, description: "类型 0:不退 1:退菜", default: 0}
  , valid           :   {type: Number, description: "删除 0:无效 1:有效", default: 1}
  , createat        :   {type: Date,   description: "创建时间"}
  , createby        :   {type: String, description: "创建者"}
  , editat          :   {type: Date,   description: "最终修改时间"}
  , editby          :   {type: String, description: "最终修改者"}
});

/**
 * 使用定义好的Schema
 * @param {string} dbname
 * @returns {model} workstation model
 */
function model(dbname) {

  return conn(dbname).model("Order", Order);
}
