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
exports.list = function(handler, callback_) {
  var code = handler.params.code
    , start = handler.params.start || 0
    , limit = handler.params.count || 20
    , keyword = handler.params.keyword
    , tags = handler.params.tags
    , condition = {
      valid : 1
    };

  if (keyword) {
    keyword = util.quoteRegExp(keyword);
    condition.name = new RegExp(keyword.toLowerCase(), "i");
  }

  if (tags){

    var or = [];
    _.each(tags.split(","), function(item){
      or.push({tags: item});
    });
    condition.$or = or;
  }
  item.total(code, condition, function (err, count) {

    item.getList(code, condition, start, limit,  function(err, result){
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



exports.add = function(handler, callback){
  var now = new Date()
    , uid = handler.uid
    , code = handler.code
    , tags = handler.params.tags;

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
    , type              : handler.params.type
    , editat: now
    , editby: handler.uid
  };

  handler.params.tags = _.compact(handler.params.tags);

  var tasks = [];
    newItem.createat = now;
    newItem.createby = handler.uid;

  tasks.push(function(cb){

    item.add(code, newItem, function(err, result){
      if (err) {
        return cb(new error.InternalServer(err));
      }

      cb(err, result);
    });
  });

  // 新增的tag，添加到tag表
  tasks.push(function(result, cb) {
    var add = _.difference(tags, result);

      tag.add(code, uid, add, function(err, result){
        cb(err, result);
      });
  });


  // 删除的tag，从tag表移除
  tasks.push(function(data, cb) {
    var remove = _.difference(data, tags);
    tag.remove(code, uid, remove, function(err, result){
      cb(err, data);
    });
  });

  async.waterfall(tasks, function(err, result){
    return callback(err, result);
  });

};
/**
 * 更新菜品
 * @param uid_
 * @param item_
 * @param callback_
 * @returns {*}
 */
exports.update = function(handler, callback) {

  var now = new Date()
    , uid = handler.uid
    , code = handler.code
    , tags = handler.params.tags;

  var newItem = {
    itemName            : handler.params.itemName
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
    , type              : handler.params.type
    , editat: now
    , editby: handler.uid
  };
  var tasks = [];
  newItem.createat = now;
  newItem.createby = handler.uid;

  tasks.push(function(cb){

    item.update(code, handler.params.id, newItem, function(err, result){
      if (err) {
        return cb(new error.InternalServer(err));
      }

      cb(err, result);
    });
  });

  // 新增的tag，添加到tag表
  tasks.push(function(result, cb) {
    var add = _.difference(tags, result);

    tag.add(code, uid, add, function(err, result){
      cb(err, result);
    });
  });


  // 删除的tag，从tag表移除
  tasks.push(function(data, cb) {
    var remove = _.difference(data, tags);
    tag.remove(code, uid, remove, function(err, result){
      cb(err, data);
    });
  });

  async.waterfall(tasks, function(err, result){
    return callback(err, result);
  });
};

exports.addimage = function(handler, callback) {

  file.add(handler, function(err, result){
    if(err){
      return callback(new error.InternalServer(err));
    }
    callback(err, result[0]._id);
  });
};

exports.remove = function(handler, callback){
  var uid = handler.uid
    , code = handler.code
    , itemId = handler.params.itemId;

  item.remove(code, uid, itemId, function(err, result){
    if (err) {
      return callback(new error.InternalServer(err));
    }
    callback(err, result);
  });
};

exports.get = function(handler, callback){
  var uid = handler.uid
    , code = handler.code
    , itemId = handler.params.itemId;

  item.get(code, itemId, function(err, result){
    if (err) {
      return callback(new error.InternalServer(err));
    }
    callback(err, result);
  });
};
