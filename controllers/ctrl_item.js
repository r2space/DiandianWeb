"use strict";

var _         = require('underscore')
  , sync      = require('async')
  , smart     = require("smartcore")
  , error     = smart.core.errors
  , user      = smart.ctrl.user
  , mod_group   = smart.mod.group
  , auth      = smart.core.auth
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
      itemName      : item_.itemName
    , itemPrice   : item_.itemPrice
    , itemType    : item_.itemType
    , itemComment : item_.itemComment
    , itemMaterial: item_.itemMaterial
    , itemMethod  : item_.itemMethod
//    , bigimage    : item_.bigimage
//    , smallimage  : item_.smallimage
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
      itemName : item.itemName
   , itemPrice : item.itemPrice
   , itemType : item.itemType
   , itemComment : item.itemComment
   , itemMaterial : item.itemMaterial
   , itemMethod : item.itemMethod
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
