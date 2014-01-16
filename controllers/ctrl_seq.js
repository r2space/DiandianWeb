"use strict";

var _       = smart.util.underscore
  , async   = smart.util.async
  , error   = smart.framework.errors
  , seq     = require('../modules/mod_sequence.js')
  , service = require('../modules/mod_service.js');


exports.getCurrVal = function (code, name, callback) {
  seq.getCurrVal(code, name, callback);
}

exports.initSequence = function (code, name, start, increment, maxvalue, cycle, callback) {

  var option = {
    name: name,
    value: start || 0,
    start: start || 0,
    increment: increment || 1,
    maxvalue: maxvalue || 9999999,
    cycle: cycle || 0
  };
  //check seq 是否存在
  seq.hasSequenceByName(code, name, function (err, has) {
    if (has) {
      return callback(err, {err: "has create seq", seq: has});
    }
    seq.createSequence(code, option, callback);
  });
};

exports.getNextVal = function (code, name, callback) {
  seq.hasSequenceByName(code, name, function (err, has) {
    if (!has) {
      return callback(err, {err: "no seq"});
    }
    seq.getNextVal(code, name, callback);
  });
}

exports.resultSeq = function(code,name,value,callback){

  seq.resetSequence(code,name,value,function(err,result){
    callback(err,result);
  });
}