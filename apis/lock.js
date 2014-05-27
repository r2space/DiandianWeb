var lockCore = require('../core/lock');
var moment = smart.util.moment;
var conf = smart.util.config;


exports.remove = function (req, res) {

  var path = req.query.path;

  lockCore.removeLock("/" + path, function (err, result) {

    if (err) {
      return res.send("-1");
    }

    res.send("ok");
  });
};

exports.set = function (req, res) {

  var path = req.query.path;
  var data = req.query.data;

  lockCore.setLock("/" + path, data, function (err, result) {

    if (err) {
      return res.send("-1");
    }

    res.send(data);
  });
};

exports.get = function (req, res) {

  var path = req.query.path;

  lockCore.getLock("/" + path, function (err, result, time) {

    if (err) {
      return res.send("-1");
    }

    var date3 = new Date().getTime() - time.getTime();
    var leave1 = date3 % (24 * 3600 * 1000);
    var leave2 = leave1 % (3600 * 1000);
    var minutes = Math.floor(leave2 / (60 * 1000));

    console.log(minutes);
    if (minutes >= conf.zookeeper.timeout) {

      lockCore.setLock("/" + path, "0", function (err, result) {

        if (err) {
          return res.send("-1");
        }

        return res.send("0");
      });

      return;
    }

    res.send(result);
  });
};

exports.createLock = function (req, res) {

  var path = req.query.path;
  var data = req.query.data;

  lockCore.createLock("/" + path, function (err, result) {

    if (err) {
      return res.json({systemError: "错误"});
    }

    lockCore.setLock("/" + path, data, function (err, result) {

      if (err) {
        return res.json({systemError: "错误"});
      }

      res.send("ok");
    });
  });
};