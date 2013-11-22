/**
 * @file 封WebSocket服务的module
 * @author Tomxu(cntomxu@gmail.com)
 * @copyright Dreamarts Corporation. All Rights Reserved.
 */
"use strict";

/**
 * 启动Websocket服务
 * @param server
 */

var testapi     = require('./apis/testapi')
  , log         = smart.framework.log
  , conf        = require("config");

/* 定义事件 */
var EVENT_CLIENT = "client"                                       // 客户端(浏览器,iPad...)通信用
  , EVENT_CLIENT_BROADCAST = "client_broadcast"                   // AP向客户端群发信息
  , EVENT_SERVER_NOTIFY_CLIENT_BROADCAST = "broadcast"            // 通知所有ap向指定room的客户端群发信息
  , EVENT_SERVER_REGISTER_CLIENT = "broadcast_register_client"    // 向中心服务器注册AP的Socket
  ;

/* 定义变量 */
var mainIO
  , socket_to_primary
  , socket_to_secondary
  , socket_to_activity
  , dispatchMap = {}
  ;


/**
 * 启动Websocket
 *
 * @param server
 */
exports.startup = function (server) {
  // 注册Action
  registerAction();
  // 启动Websocket服务
  startupServer(server);
  // 连接中心服务器
  connectCenterServer();
}

/**
 * 启动Websocket服务
 */
function startupServer(server){
  mainIO = require('socket.io').listen(server);
  log.info("Wetsocket server startd");

  mainIO.configure('development', function () {
    mainIO.set('log level', 1);
  });

  mainIO.sockets.on('connection', function (socket) {
    //log.info("Socket connected");

    // 设置当前客户端soket的Room号
    var room = "test";
    var room_ap = room + "ap";
    socket.join(room);

    // Ap服务器监听消息，监听客户端的消息
    {
      socket.on(EVENT_CLIENT, function (data) {
        dispatch(socket, room, data);
      });
    }

    // Center Server(中心服务器)监听的消息，目前主要是ap发送请求分发消息
    {
      socket.on(EVENT_SERVER_NOTIFY_CLIENT_BROADCAST, function (data) {
        // 通知所有AP向指定room的客户端发送消息
        mainIO.sockets.in(room_ap).emit(EVENT_CLIENT_BROADCAST, data);
      });

      socket.on(EVENT_SERVER_REGISTER_CLIENT, function (data) {
        socket.leave(room);
        socket.join(room_ap);
        log.info("Wetsocket join room" + room_ap);
        socket.emit(EVENT_SERVER_REGISTER_CLIENT, data);
      });
    }
  });
}

/**
 * 连接中心服务器
 */
function connectCenterServer()
{
  connectPrimary();
  connectSecondly();
}
/**
 * 连接主中心服务器
 */
function connectPrimary()
{
  var url = conf.websocket.center_server.primary;
  _connectCenterServer(socket_to_primary, url);
  socket_to_activity = socket_to_primary;
}
/**
 * 连接备用中心服务器
 */
function connectSecondly()
{
  var url = conf.websocket.center_server.secondary;
  if(url && url != "")
    _connectCenterServer(socket_to_secondary, url);
}
function _connectCenterServer(socket, url)
{
  socket = require('socket.io-client').connect(url);
  socket.on('connect', function(){
    log.info("Websocket connected to Center Server: " + url);

    // 注册AP
    socket.emit(EVENT_SERVER_REGISTER_CLIENT, {});
    socket.on(EVENT_SERVER_REGISTER_CLIENT, function(data){
      log.info("Wetsocket resistery ap success!");
    });

    socket.on(EVENT_CLIENT_BROADCAST, function (data) {
      // AP向所有room的客户端发送消息
      dispatchBroadcast(data);
    });
  });
}

/**
 * 生成广播消息数据
 * @param action
 * @param data
 * @param room
 * @returns {{}}
 */
exports.dataForwardBroadcast = function(action, data, room) {
  var res = {};
  res.action = "forward";

  res.room = room;
  res.data = data || {};
  res.data.action = action;
  return res;
}

/**
 * 广播消息
 * @param data
 */
exports.broadcast = function(data) {
  socket_to_activity.emit(EVENT_SERVER_NOTIFY_CLIENT_BROADCAST, data);
}

/**
 * 给消息分配Action
 * @param socket
 * @param data
 */
function dispatch(socket, room, data) {
  var action = dispatchMap[data.action];

  if(!action) {
    log.error("Websocket: Dispatch Action isn't exist!  " + data);
    return;
  }

  action(data, function(err, res, broadcastData){
    if(data) {
      // 指定返回数据的Action
      var res = res || {};
      res.action = data.action;

      socket.emit(EVENT_CLIENT, res);
    }

    if(broadcastData) {
      broadcastData.room = room;
      exports.broadcast(broadcastData);
    }
  });
}

/**
 * 给广播消息分配Action
 * @param socket
 * @param room
 * @param data
 */
function dispatchBroadcast(data) {
  var action = dispatchMap[data.action];

  if(!action) {
    log.error("Websocket: Dispatch BroadcastAction isn't exist!  " + data);
    return;
  }

  action(data.data, function(err, res){
    // 指定返回数据的Action
    var res = res || {};
    res.action = data.data.action;

    if(data.room) {
      mainIO.sockets.in(data.room).emit(EVENT_CLIENT, res);
    } else {
      mainIO.sockets.emit(EVENT_CLIENT, res);
    }
  });
}

/**
 * 注册Action
 */
function registerAction() {
  // 转发消息Action,仅仅把数据转发到客户端
  dispatchMap["forward"] = function(data, callback) {
    callback(null, data);
  };

  // 测试用的Action
  dispatchMap["test"] = testapi.test;
  //dispatchMap["test1"] = testapi.test1;
}
