/**
 * @file 存取公司信息的controllers
 * @author Sara(fyx1014@hotmail.com)
 * @copyright Dreamarts Corporation. All Rights Reserved.
 */

"use strict";

var _           = require('underscore')
  , async     = require('async')
  , menu        = require('../modules/mod_menu.js')
  , item        = require('../modules/mod_item.js')
  , smart       = require("smartcore")
  , error       = smart.core.errors;

exports.add = function(code, uid, menuData, callback_){
  var now = new Date();

  var newMenu = {
    name    : menuData.name,
    comment: menuData.comment,
    status  : menuData.status,
    page    : menuData.page,
    items   : menuData.items,
    editat  : now,
    editby  : uid
  };

  var id = menuData.id;

  if (id) {

    menu.update(code, id, newMenu, function(err, result){
      if (err) {
        return callback_(new error.InternalServer(err));
      }

      callback_(err, result);
    });
  } else {
    newMenu.createat = now;
    newMenu.createby = uid;

    menu.add(code, newMenu, function(err, result){
      if (err) {
        return callback_(new error.InternalServer(err));
      }

      callback_(err, result);
    });

  }
};

exports.get = function(code, user_, menuId, callback_){

  menu.get(code, menuId, function(err, result){
    if (err) {
      return callback_(new error.InternalServer(err));
    }

    async.forEach(result.items, function(it, call2){
      item.get(code, it.itemId, function(e, res) {
        it._doc.image = res.bigimage;
        call2(e);
      });

    }, function(err) {
      callback_(err, result);
    });
  });
};

exports.remove = function(code, user_, menuId , callback_){

  menu.remove(code, user_, menuId, function(err, result){
    if (err) {
      return callback_(new error.InternalServer(err));
    }
    callback_(err, result);
  });
};

exports.list = function(code, condition, start, limit, callback_) {

  menu.total(code, condition, function (err, count) {

    menu.getList(code, condition, start, limit,  function(err, result){
      if (err) {
        return callback_(new error.InternalServer(err));
      }

      return callback_(err, {items: result, totalItems: count});

    });
  });
};

exports.appList = function(code, condition, start, limit, callback_) {

  menu.total(code, condition, function (err, count) {

    menu.getList(code, condition, start, limit,  function(err, result){
      if (err) {
        return callback_(new error.InternalServer(err));
      }
      getEachMenuList(code,result,function(err,resultDocs){
        return callback_(err, {items: resultDocs, totalItems: count});
      });

    });
  });
};

function getEachMenuList(code,menuList, callback) {


  var tempMenuList = [];
  for(var i in menuList){
    console.log(i);
    menuList[i]._doc._index = i;
  }


  async.forEach(menuList, function (menu,cb) {
    getItemListByMenu(code, menu,function(err,itemsListDocs){
      console.log(menu._doc._index);
      menu._doc.items = itemsListDocs;
      tempMenuList[menu._doc._index] = menu;
      cb(null,menu);
    });
  }, function (err, result) {

    return callback(null ,tempMenuList);
  });
}

function getItemListByMenu (code,menu,callback){
  var itemList = menu.items;
  var tempList = [];
  for(var i in itemList){
    itemList[i]._index = i;
  }
  async.forEach(itemList, function(itemObj,cb){

    item.get(code, itemObj.itemId,function(err,itemDocs){

      itemObj._doc.item = itemDocs;
      tempList[itemObj._index] = itemObj;
      cb(null,itemDocs);

    });

  } , function(err,result){
    callback(null,tempList);
  });
}

