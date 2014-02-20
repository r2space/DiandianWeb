/**
 * Created by ZengXR on 12/12/13.
 */

"use strict";

var mongo       = smart.util.mongoose
  , conn        = smart.framework.connection
  , schema      = mongo.Schema;



/**
 * 打印机
 * @type {schema}
 */
var Printer = new schema({
    name            :   {type: String, description: "打印机名字"}
  , printerIP       :   {type: String, description: "打印机的IP"}
  , type            :   {type: String, description: "打印类型 1:厨房打印 2：结账打印", default: 1}
  , need            :   {type: Number, description: "0:不打印 1:打印", default: 1}
  , valid           :   {type: Number, description: "删除 0:无效 1:有效", default: 1}
  , lock            :   {type: String, description: "打印机锁,用于控制多个iPad连接打印机时的资源冲突"}
  , lockTime        :   {type: Date, description: "打印机加锁时间"}
  , createat        :   {type: Date,   description: "创建时间"}
  , createby        :   {type: String, description: "创建者"}
  , editat          :   {type: Date,   description: "最终修改时间"}
  , editby          :   {type: String, description: "最终修改者"}
});

/**
 * 使用定义好的Schema,通过Code生成printer的model
 * @param {string} code
 * @returns {model} priter model
 */
function model(dbname) {

  return conn.model(dbname, "Printer", Printer);
}

/**
 * 添加打印机
 * @param {string} code 公司code
 * @param {object} newPrinter    新的打印机
 * @param {function} callback 返回素材添加结果
 */
exports.add = function(code, newPrinter, callback) {

  console.log(newPrinter);
  var printer = model(code);

  new printer(newPrinter).save(function(err, result) {
    callback(err, result);
  });
};

/**
 * 更新指定素材
 * @param {string} code 公司code
 * @param {string} printerID打印机ID
 * @param {object} conditions 更新条件
 * @param {function} callback 返回更新结果
 */
exports.update = function(code, printerId, newPrinter, callback) {

  var printer = model(code);
  console.log(printerId)

  printer.findByIdAndUpdate(printerId, newPrinter, function(err, result) {
    callback(err, result);
  });
};

/**
 * 删除
 * @param {string} code 公司code
 * @param {string} uid  更新者ID
 * @param {string} printerId 打印机ID
 * @param {function} callback 返回删除结果
 */
exports.remove = function (code, uid, printerId, callback) {

  var printer = model(code);

  printer.findByIdAndUpdate(printerId, {valid: 0, editat: new Date(), editby: uid}, function(err, result) {
    callback(err, result);
  });
};

/**
 * 获取一览
 * @param {string} code 公司code
 * @param {object} condition 条件
 * @param {function} callback 返回打印机一览
 */
exports.getList = function(code, condition, start, limit, callback) {

  var desk = model(code);

  desk.find(condition)
    .skip(start || 0)
    .limit(limit || 20)
    .sort({editat: -1})
    .exec(function(err, result) {
      callback(err, result);
    });
};

/**
 * 获取件数
 * @param {string} code 公司Code
 * @param {object} condition 条件
 * @param {function} callback 返回打印机件数
 */
exports.total = function(code, condition, callback) {

  var printer = model(code);

  printer.count(condition).exec(function(err, count) {
    callback(err, count);
  });
};

/**
 * 获取指定打印机
 * @param {string} code 公司code
 * @param {string} printerId 打印机ID
 * @param {function} callback 返回指定打印机
 */
exports.get = function(code, printerId, callback) {

  var printer = model(code);

  printer.findOne({valid: 1, _id: printerId}, function(err, result) {
    callback(err, result);
  });
};


