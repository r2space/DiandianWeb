
var act   = require('../ws/action');

exports.test = function(data, callback) {
  var err = null;
  var result = {a:"b",b:"c"};
  callback(err, result,
    act.dataBroadcast("refresh_table", {deskId: "22222", boast:"dddd"})
  );
}

exports.test1 = function(data, callback) {
  var err = null;
  var result = {cccccc:"########",ddddddddddd:"########"};
  callback(err, result);
}