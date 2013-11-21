
/**
 *
 */
var mongo = require('mongoose')
  , util = require('util')
  , log = require("smartcore").framework.log
  , dbconf = process.env['TEST'] ? require('config').testdb : require('config').db;

/**
 * Connection map
 * Formatter : { key1: value1, key2: value2 }
 * Desc      :   key   : hostname
 *               value : connection
 * @type {{}}
 */
var connectionMap = {}; //


module.exports = function(dbname) {
  return getConn(dbname);
};

exports.getActivityConnectionList =  function() {
  var list = [];
};

/**
 * 取得连接
 * @param dbname
 * @returns {*}
 */
function getConn(dbname) {
  // Set default dbname
  dbname = dbname || dbconf.dbname;

  var conn = connectionMap[dbname];
  var host = dbconf.host;
  var port = dbconf.port;
  var poolSize = dbconf.pool;

  // 无连接
  if (!conn) {
    log.info('Create a connection. ');
    return createConnection(host, port, dbname, poolSize);
  }

  // 连接被断开
  if (conn.readyState == 0) {
    log.info('Re-new the connection');
    return createConnection(host, port, dbname, poolSize);
  }

  return conn;
}

/**
 * 创建一个新的连接
 */
function createConnection(host, port, dbname, poolSize) {
  var conn= mongo.createConnection(
    util.format('mongodb://%s:%d/%s', host, port, dbname), {server: {poolSize: poolSize}}
  );
  connectionMap[dbname] = conn;

  log.info('Database name "' + dbname + '". The connection pool size of ' + poolSize);
  return conn;
}

