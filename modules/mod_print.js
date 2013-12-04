/**
 * Created by Antony on 13-12-1.
 */


"use strict";

var mongo       = smart.util.mongoose
  , conn        = smart.framework.connection
  , schema      = mongo.Schema;



/**
 * 订单
 * @type {schema}
 */
var Print = new schema({
    deskId          :   {type: String, description: "台位ID"}
  , serviceId       :   {type: String, description: "服务的Id"}
  , orderNum        :   {type: String, description: "订单组"}
  , userId          :   {type: String, description: "服务员的Id"}
  , orderIds        :   [String]
  , status          :   {type: Number, description: "1 : 新订单   2  : 打印成功   3 :打印失败  4 : 取消打印", default: 1}
  , valid           :   {type: Number, description: "删除 0:无效 1:有效", default: 1}
  , remark          :   {type: String, description: "备注"}

  , createat        :   {type: Date,   description: "创建时间"}
  , createby        :   {type: String, description: "创建者"}
  , editat          :   {type: Date,   description: "最终修改时间"}
  , editby          :   {type: String, description: "最终修改者"}
});