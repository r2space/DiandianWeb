
var sys = require('sys')
  , _ = require('underscore')
  , exec = require('child_process').exec;

var Db = require('mongodb').Db
  , Server = require('mongodb').Server
  , conf = process.env['TEST'] ? require('config').testdb : require('config').db;

var ServerOptions = {auto_reconnect: false, poolSize: 1};
var DbOptions = {native_parser: false, w: 1};

/**
 * 获取命令行参数
 * @returns {Array}
 */
exports.params = function() {
  var params = [];
  process.argv.forEach(function (val, index, array) {
    params = array;
  });

  params.shift();
  params.shift();
  return params;
};

/**
 * 执行本地sh命令
 * @param command
 * @param callback
 */
exports.runCommand = function(command, callback) {
  var child = exec(command, function (error, stdout, stderr) {
    callback(error, stdout);
  });

  return child;
};

/**
 * 执行远程sh命令
 * @param host
 * @param command
 * @param callback
 */
exports.runRemoteCommand = function(host, command, callback) {
  var cmd = "ssh -i tool/amazon.pem root@" + host + " '" + command + "'";
  exports.runCommand(cmd, callback);
};

/**
 * 执行Mongodb Admin命令
 * @param command
 * @param callback
 */
exports.runDBCommand = function(code, command, callback) {
  var db = new Db(code, new Server(conf.host, conf.port, ServerOptions), DbOptions);
  db.open(function(err, db){
    var admin = db.admin();
    admin.command(command, function(err, info){
      db.close();
      callback(err, info);
    });
  });
};

/**
 * 给指定的表，插入数据
 * @param code
 * @param collection
 * @param data
 * @param callback
 */
exports.insertData = function(code, collection, data, callback) {
  var db = new Db(code, new Server(conf.host, conf.port, ServerOptions), DbOptions);
  db.open(function(err, db){

    db.collection(collection).insert(data, {w: 1}, function(err, result){
      callback(err, result);
      db.close();
    });
  });
}