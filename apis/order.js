
var ws   = require('../ws/websocket');

exports.addOrder = function(data, callback) {
  var err = null;

  var orderList = data.data.orderList;
  for(var i in orderList){
    console.log(orderList[i]);
  }

  callback(err, orderList);
}