"use strict";

var  ph        = require('path')
  , fs        = require('fs')
  , async     = require('async')
  , _         = require('underscore')
  , sync      = require('async')
  , smart     = require("smartcore")
  , gridfs    = smart.mod.gridfs
  , error     = smart.core.errors
  , user      = smart.ctrl.user
  , mod_group   = smart.mod.group
  , confapp   = require('config').app
  , auth      = smart.core.auth
  , group     = smart.mod.group
  , log  =smart.framework.log
  , tag       = require('./ctrl_tag')
  , item   = require('../modules/mod_item.js');

/**
 * 获取菜品一览
 * @param start_
 * @param limit_
 * @param callback
 */
exports.list = function(code_, condition_, start_, limit_, callback_) {

  item.total(code_, condition_, function (err, count) {

    item.getList(code_, condition_, start_, limit_,  function(err, result){
      if (err) {
        return callback_(new error.InternalServer(err));
      }

      return callback_(err, {items: result, totalItems: count});
    });
  });
};


exports.searchOne = function( compid, callback_) {
  item.get(compid, function(err, result){
    if (err) {
      return callback_(new error.InternalServer(err));
    }
    return callback_(err, result);
  });

};



exports.add = function(code_, uid_, item_, callback_){
  var now = new Date();

  var newItem = {
      itemName          : item_.itemName
    , itemPriceNormal   : item_.itemPriceNormal
    , itemPriceHalf     : item_.itemPriceHalf
    , itemPriceDiscount : item_.itemPriceDiscount
    , itemType          : item_.itemType
    , itemComment       : item_.itemComment
    , itemMaterial      : item_.itemMaterial
    , itemMethod        : item_.itemMethod
    , bigimage          : item_.bigimage
    , smallimage        : item_.smallimage
    , tags              : item_.tags
    , editat: now
    , editby: uid_
  };

//  item_.tags = _.compact(item_.tags);
//
//  var tasks = [];
//
//  // 获取原来的tag一览
//  tasks.push(function(cb) {
//    item.get(code_, item_._id, function(err, data) {
//      cb(err, data.tags);
//    });
//  });
//
//  // 新增的tag，添加到tag表
//  tasks.push(function(data, cb) {
//    var add = _.difference(item_.tags, data);
//
//    if (add && add.length > 0) {
//      tag.add(code_, uid_, add, function(err, result){
//        cb(err, data);
//      });
//    } else {
//      cb(null, data);
//    }
//  });
//
//  // 删除的tag，从tag表移除
//  tasks.push(function(data, cb) {
//    var remove = _.difference(data, item_.tags);
//
//    if (remove && remove.length > 0) {
//      tag.remove(code_, uid_, remove, function(err, result){
//        cb(err, data);
//      });
//    } else {
//      cb(null, data);
//    }
//  });
//
//  // 删除的tag，从tag表移除
//  tasks.push(function(data, cb) {
//    var remove = _.difference(data, item_.tags);
//
//    if (remove && remove.length > 0) {
//      tag.remove(code_, uid_, remove, function(err, result){
//        cb(err, data);
//      });
//    } else {
//      cb(null, data);
//    }
//  });
//
//  async.waterfall(tasks, function(err, result){
//    return callback_(err, result);
//  });

  var id = item_.id;

  if (id) {

    item.update(code_, id, newItem, function(err, result){
      if (err) {
        return callback_(new error.InternalServer(err));
      }

      callback_(err, result);
    });
  } else {
    newItem.createat = now;
    newItem.createby = uid_;

    item.add(code_, newItem, function(err, result){
      if (err) {
        return callback_(new error.InternalServer(err));
      }

      callback_(err, result);
    });

  }
};
/**
 * 更新菜品
 * @param uid_
 * @param item_
 * @param callback_
 * @returns {*}
 */
exports.update = function(code_, uid_, item_, callback_) {

  var now = new Date();

  var newItem = {
      itemName : item_.itemName
   , itemPriceNormal   : item_.itemPriceNormal
   , itemPriceHalf     : item_.itemPriceHalf
   , itemPriceDiscount : item_.itemPriceDiscount
   , itemType : item_.itemType
   , itemComment : item_.itemComment
   , itemMaterial : item_.itemMaterial
   , itemMethod : item_.itemMethod
   , editat: now
   , editby: uid_
  };

  var id = item_.id;

  if (id) {

    item.update(code_, id, newItem, function(err, result){
      if (err) {
        return callback_(new error.InternalServer(err));
      }

      callback_(err, result);
    });
  } else {
    newItem.createat = now;
    newItem.createby = uid_;

    item.add(code_, newItem, function(err, result){
      if (err) {
        return callback_(new error.InternalServer(err));
      }

      callback_(err, result);
    });

  }
};

exports.addimage = function(code_, uid_, files_, callback_) {

  var result;

  async.forEach(files_, function(file, callback){

    var name = ph.basename(file.name);
    var path = fs.realpathSync(ph.join(confapp.tmp, ph.basename(file.path)));
    var metadata = {
      "author": uid_

    };


    // To save the file to GridFS
    gridfs.save(code_, name, path, metadata, "", function(err, doc){

      if (err) {
        return callback(new error.InternalServer(err));
      }

      result = doc._id;
      callback(null,result);
    });

  },function(err){
    return callback_(err, result);
  });

};

exports.remove = function(code_, user_, itemId_ , callback_){

  item.remove(code_, user_, itemId_, function(err, result){
    if (err) {
      return callback_(new error.InternalServer(err));
    }
    callback_(err, result);
  });
};

exports.get = function(code_, user_, itemId_, callback_){

  item.get(code_, itemId_, function(err, result){
    if (err) {
      return callback_(new error.InternalServer(err));
    }
    callback_(err, result);
  });
};
