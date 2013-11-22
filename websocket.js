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
  , log         = smart.framework.log;

var MSG_TYPE_CLIENT = "client";
var MSG_TYPE_BROADCAST = "broadcast";

var io;
var socket_to_primary;
var socket_to_second;
var dispatchMap = {};


/**
 * 启动Websocket
 *
 * @param server
 */
exports.startup = function (server) {
  io = require('socket.io').listen(server);
  log.info("Wetsocket server startd");

  io.configure('development', function () {
    io.set('log level', 1);
  });

  io.sockets.on('connection', function (socket) {
    //log.info("Socket connected");

    // 设置当前客户端soket的Room号
    var room = "test";
    socket.join(room);

    // Ap服务器监听消息，监听客户端的消息
    {
      socket.on(MSG_TYPE_CLIENT, function (data) {
        dispatch(socket, data);
      });
    }

    // Center Server(中心服务器)监听的消息，目前主要是ap发送请求分发消息
    {
      socket.on(MSG_TYPE_BROADCAST, function (data) {
        dispatchBroadcast(socket, room, data);
      });
    }
  });

  // 注册Action
  registerAction();

  // 连接中心服务器
  connectCenterServer();
}


exports.dataBroadcast = function(action, room, data) {
  var res = {};
  res.action = action;

  res.room = (room && room != "") ? room : undefined;
  res.data = data || {};
  res.data.action = action;
  return res;
}
exports.dataForwardBroadcast = function(action, room, data) {
  var res = {};
  res.action = "forward";

  res.room = (room && room != "") ? room : undefined;
  res.data = data || {};
  res.data.action = action;
  return res;
}

/**
 * 广播消息
 * @param data
 */
exports.broadcast = function(data) {
  socket_to_primary.emit(MSG_TYPE_BROADCAST, data);
}


function connectCenterServer()
{
  var url = 'http://localhost:3000';
  socket_to_primary = require('socket.io-client').connect(url);
  socket_to_primary.on('connect', function(){
    log.info("Websocket connected to Center Server: " + url);
  });
}

/**
 * 给消息分配Action
 * @param socket
 * @param data
 */
function dispatch(socket, data) {
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

      socket.emit(MSG_TYPE_CLIENT, res);
    }

    if(broadcastData) {
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
function dispatchBroadcast(socket, room, data) {
  var action = dispatchMap[data.action];

  if(!action) {
    log.error("Websocket: Dispatch BroadcastAction isn't exist!  " + data);
    return;
  }

  action(data.data, function(err, res){
    // 指定返回数据的Action
    var res = res || {};
    res.action = data.data.action;

    if(room) {
      socket.broadcast.to(room).emit(MSG_TYPE_CLIENT, res);
    } else {
      socket.broadcast.emit(MSG_TYPE_CLIENT, res);
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
