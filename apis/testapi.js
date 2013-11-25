
var act   = require('../ws/action')
  , desk  = require('./desk');

exports.test = function(data, callback) {
  var err = null;
  var result = {a:"b",b:"c"};
  callback(err, result,
    act.dataBroadcast("refresh_desk", {deskId: "528c49abde98051836000002", boast:"dddd"})
    ,act.dataBroadcast("refresh_desk", {deskId: "528c49abde98051836000002", boast:"dddd"})
  );
}

exports.test1 = function(data, callback) {
  var err = null;
  var result = {cccccc:"########",ddddddddddd:"########"};
  callback(err, result);
}