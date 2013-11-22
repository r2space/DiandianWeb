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
  , user        = smart.ctrl.user
  , group       = smart.ctrl.group
  , mod_group   = smart.mod.group
  , error       = smart.core.errors;

exports.add = function(code_, uid_, desk_, callback_){
  var now = new Date();

  var newDesk = {
    name: desk_.name,
    type :desk_.type,
    capacity:desk_.capacity,
    editat: now,
    editby: uid_
  };

  var id = desk_.id;

  if (id) {

    desk.update(code_, id, newDesk, function(err, result){
      if (err) {
        return callback_(new error.InternalServer(err));
      }

      callback_(err, result);
    });
  } else {
    newDesk.createat = now;
    newDesk.createby = uid_;

    desk.add(code_, newDesk, function(err, result){
      if (err) {
        return callback_(new error.InternalServer(err));
      }

      callback_(err, result);
    });

  }
};

exports.get = function(code_, user_, deskId_, callback_){

  desk.get(code_, deskId_, function(err, result){
    if (err) {
      return callback_(new error.InternalServer(err));
    }
    callback_(err, result);
  });
};

exports.remove = function(code_, user_, deskId_ , callback_){

  desk.remove(code_, user_, deskId_, function(err, result){
    if (err) {
      return callback_(new error.InternalServer(err));
    }
    callback_(err, result);
  });
};

exports.list = function(code_, condition_, start_, limit_, callback_) {

  desk.total(code_, condition_, function (err, count) {

    desk.getList(code_, condition_, start_, limit_,  function(err, result){
      if (err) {
        return callback_(new error.InternalServer(err));
      }


      return callback_(err, {items: result, totalItems: count});
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