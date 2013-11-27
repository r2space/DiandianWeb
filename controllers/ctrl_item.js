"use strict";

var  ph       = smart.lang.path
  , fs        = smart.lang.fs
  , async     = smart.util.async
  , _         = smart.util.underscore
  , gridfs    = smart.ctrl.file
  , error     = smart.framework.errors
  , user      = smart.ctrl.user
  , confapp   = smart.util.config.app
  , auth      = smart.framework.auth
  , log       = smart.framework.log
  , file      = smart.ctrl.file
  , tag       = require('./ctrl_tag')
  , item      = require('../modules/mod_item.js');

/**
 * 获取菜品一览
 * @param start_
 * @param limit_
 * @param callback
 */
exports.list = function(code_, condition_, tag, start_, limit_, callback_) {

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



exports.add = function(handler, callback_){
  var now = new Date();

  var newItem = {
      itemName          : handler.params.itemName
    , itemPriceNormal   : handler.params.itemPriceNormal
    , itemPriceHalf     : handler.params.itemPriceHalf
    , itemPriceDiscount : handler.params.itemPriceDiscount
    , itemType          : handler.params.itemType
    , itemComment       : handler.params.itemComment
    , itemMaterial      : handler.params.itemMaterial
    , itemMethod        : handler.params.itemMethod
    , bigimage          : handler.params.bigimage
    , smallimage        : handler.params.smallimage
    , tags              : handler.params.tags
    , editat: now
    , editby: handler.uid
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

//  var id = item_.id;
//
//  if (id) {
//
//    item.update(code_, id, newItem, function(err, result){
//      if (err) {
//        return callback_(new error.InternalServer(err));
//      }
//
//      callback_(err, result);
//    });
//  } else {
    newItem.createat = now;
    newItem.createby = handler.uid;

    item.add(handler.code, newItem, function(err, result){
      if (err) {
        return callback_(new error.InternalServer(err));
      }

      callback_(err, result);
    });

//  }
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

exports.addimage = function(handler, callback) {

  file.add(handler, function(err, result){
    if(err){
      return callback(new error.InternalServer(err));
    }
    callback(err, result[0]._id);
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
