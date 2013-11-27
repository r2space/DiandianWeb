/**
 * @file 存取序列信息的module
 * @author lihao(h_li@dreamarts.co.jp)
 * @copyright Dreamarts Corporation. All Rights Reserved.
 */

"use strict";

var mongo       = smart.util.mongoose
  , conn        = smart.framework.connection
  , schema      = mongo.Schema;

/**
 *
 * @type {schema}
 */
var SequenceSchema = new schema({
  name: {type: String, description: "序列的名字"}
  , value: {type: Number, description: "序列的值"}
  , increment: {type: Number, description: "增长"}
  , start: {type: Number, description: "开始"}
  , maxvalue: {type: Number, description: "开始"}
  , cycle: {type: Number, description: "0  不循环  2  循环"}
  , valid: {type: Number, description: "0  无效  1  有效", default: 1}
  , createat: {type: Date, description: "创建时间"}
  , createby: {type: String, description: "创建者"}
  , editat: {type: Date, description: "最终修改时间"}
  , editby: {type: String, description: "最终修改者"}
});

/**
 *
 * @param {string} code
 * @returns {model} workstation model
 */
function model(code) {

  return conn.model(code, "Sequence", SequenceSchema);
}
exports.hasSequenceByName = function (code, name, callback) {
  var Sequence = model(code);
  Sequence.findOne({name: name}, callback);
};

exports.getCurrVal = function (code, name, callback) {
  var Sequence = model(code);
  console.log(name);
  Sequence.findOne({name: name}, function (err, seq) {
    console.log(seq);
    callback(null, seq.value);
  });
};

exports.setCurrVal = function (code, name, value, callback) {

};

exports.resetSequence = function (code, name, callback) {

};

exports.createSequence = function (code, option, callback) {
  var Sequence = model(code);

  var defaultOption = {
    name: option.name, value: option.start || 0, start: option.start || 0, increment: option.increment || 1, maxvalue: option.maxvalue || 9999999, cycle: option.cycle || 0
  };

  new Sequence(defaultOption).save(function (err, result) {
    callback(err, result);
  });
};

exports.getNextVal = function (code, name, callback) {
  var Sequence = model(code);

  Sequence.findOneAndUpdate({name: name}, {$inc: { value: 1 }}, function (err,seq) {
    callback(null, seq.value);
  });

};
