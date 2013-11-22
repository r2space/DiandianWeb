
var ws   = require('../websocket');

exports.test = function(data, callback) {
  var err = null;
  var result = {a:"b",b:"c"};
  callback(err, result,
    ws.dataForwardBroadcast("updateTable", {boast:"dddd"})
  );
}

exports.test1 = function(data, callback) {
  var err = null;
  var result = {cccccc:"########",ddddddddddd:"########"};
  callback(err, result);
}