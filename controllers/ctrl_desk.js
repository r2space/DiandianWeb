/**
 * @file 存取公司信息的controllers
 * @author Sara(fyx1014@hotmail.com)
 * @copyright Dreamarts Corporation. All Rights Reserved.
 */

"use strict";

var _           = require('underscore')
  , desk        = require('../modules/mod_desk.js')
  , service        = require('../modules/mod_service.js')
  , async       = require('async')
  , smart       = require("smartcore")
  , error       = smart.core.errors;

exports.add = function(code, uid, deskData, callback){
  var now = new Date();

  var newDesk = {
    name: deskData.name,
    type :deskData.type,
    capacity:deskData.capacity,
    sortLevel:deskData.sortLevel || 10,
    editat: now,
    editby: uid
  };

  var id = deskData.id;

  if (id) {

    desk.update(code, id, newDesk, function(err, result){
      if (err) {
        return callback(new error.InternalServer(err));
      }

      callback(err, result);
    });
  } else {
    newDesk.createat = now;
    newDesk.createby = uid;

    desk.add(code, newDesk, function(err, result){
      if (err) {
        return callback(new error.InternalServer(err));
      }

      callback(err, result);
    });

  }
};

exports.get = function(code, user_, deskId, callback){

  desk.get(code, deskId, function(err, result){
    if (err) {
      return callback(new error.InternalServer(err));
    }
    callback(err, result);
  });
};

exports.remove = function(code, user_, deskId , callback){

  desk.remove(code, user_, deskId, function(err, result){
    if (err) {
      return callback(new error.InternalServer(err));
    }
    callback(err, result);
  });
};

exports.list = function(code, condition, start, limit, callback) {

  desk.total(code, condition, function (err, count) {
    if (err) {
      return callback(new error.InternalServer(err));
    }

    desk.getList(code, condition, start, limit,  function(err2, result){
      if (err2) {
        return callback(new error.InternalServer(err2));
      }
      return callback(err, {items: result, totalItems: count});
    });
  });
};


exports.appList = function(code_, condition_, start_, limit_, callback_) {

  desk.total(code_, condition_, function (err, count) {

    desk.getList(code_, condition_, start_, limit_,  function(err, result){
      if (err) {
        return callback_(new error.InternalServer(err));
      }
      getServiceStatus(code_,result,function(err,docs){
        return callback_(err, {items: docs, totalItems: count});
      });

    });
  });
};

function getServiceStatus(code,deskList,callback){
  var tempResult = [];
  async.forEach(deskList,function(deskDocs,cb){
    service.findStatus(code,deskDocs._id,function(err,serviceDocs){
      var tmpObj = deskDocs;
      if(serviceDocs && serviceDocs.length > 0)
        tmpObj._doc.service = serviceDocs[0];

      tempResult.push(tmpObj);
      cb(err,serviceDocs);
    });
  },function(err,docs){
    callback(null,tempResult);
  });

}
