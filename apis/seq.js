var code = "diandian";
var seq = require("../controllers/ctrl_seq.js");
var async = require('async')
  , response = smart.framework.response

exports.currVal = function (req_, res_) {
  var code = "diandian"
    , name = req_.query.name
  seq.getCurrVal(code, name, function (err, result) {
    response.send(res_, err, result);
  });
}

exports.nextVal = function (req_, res_) {
  var code = "diandian"
    , name = req_.query.name
  seq.getNextVal(code, name, function (err, result) {
    response.send(res_, err, result);
  });

}
// 获取一览
exports.initSeq = function (req_, res_) {

  var code = "diandian"
    , name = req_.query.name
    , start = req_.query.start || 0
    , increment = req_.query.increment || 1
    , maxvalue = req_.query.maxvalue || 99999
    , cycle = req_.query.cycle || 0


  seq.initSequence(code, name, start, increment, maxvalue, cycle, function (err, result) {
    response.send(res_, err, result);
  });

};