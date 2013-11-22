/**
 * @file 存取台位服务信息module
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
var Service = new schema({
    deskId          :   {type: String, description: "台位ID"}
  , type            :   {type: Number, description: "1 开台   2 排队    3 外卖"}
  , status          :   {type: Number, description: "0 空闲   1 就餐中   3  结账"}
  , people          :   {type: Number, description: "就餐人数"}
  , unfinishedCount :   {type: Number, description: "未上菜数"}
  , billNum          :   {type: String, description: "订单编号"}
  , orderNo         :   {type: String, description: "订单序号"}
  , phone           :   {type: String, description: "订餐电话"}
  , takeout         :   {type: String, description: "0 打包  1  外送"}


  , amount          :   {type: String, description: "总价"}
  , profit          :   {type: String, description: "实际收入"}
  , agio            :   {type: String, description: "折扣"}
  , preferential    :   {type: String, description: "优惠券"}

  , payType          :   {type: String, description: "支付方式"}

  , createat        :   {type: Date, description: "创建时间"}
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

  return conn(dbname).model("Service", Service);
}
exports.add = function(code, newService, callback) {

  var service = model(code);

  new service(newService).save(function(err, result) {
    callback(err, result);
  });
};

exports.findStatus = function(code,deskId,callback){
  var service = model(code);

  service.find({deskId:deskId})
    .limit(1)
    .sort({editat: -1})
    .exec(function(err, result) {
      callback(err, result);
    });
}