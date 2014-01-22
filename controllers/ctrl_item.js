"use strict";

var fs        = smart.lang.fs
  , async     = smart.util.async
  , _         = smart.util.underscore
  , gridfs    = smart.ctrl.file
  , error     = smart.framework.errors
  , user      = smart.ctrl.user
  , auth      = smart.framework.auth
  , log       = smart.framework.log
  , file      = smart.ctrl.file
  , util      = smart.framework.util
  , tag       = require('./ctrl_tag')
  , order       = require('../modules/mod_order.js')
  , item      = require('../modules/mod_item.js')
  , soldout   = require('../modules/mod_soldout.js')


/**
 * 获取菜品一览
 * @param start_
 * @param limit_
 * @param callback
 */
exports.appList = function(handler, callback_) {
  var code      = handler.params.code
    , start     = handler.params.start || 0
    , limit     = handler.params.count || 20
    , keyword   = handler.params.keyword
    , tags      = handler.params.tags
    // 售罄  0 全部 1 未售罄 2 售罄
    , soldoutType      = handler.params.soldoutType || 2
    , condition = {
      valid : 1
    };

  if (keyword) {
    keyword = util.quoteRegExp(keyword);
    condition.itemName = new RegExp(keyword.toLowerCase(), "i");
  }

  if (tags){

    var or = [];
    _.each(tags.split(","), function(item){
      or.push({tags: item});
    });
    condition.$and = or;
  }


  soldout.getList(code, {}, 0, 0, function (err, soldoutResult) {

    var tmpSoldoutList = [];
    if(soldoutResult && soldoutResult.length > 0) {
      for(var i in soldoutResult) {
        tmpSoldoutList.push(soldoutResult[i].itemId);
      }
    }

    if ( soldoutType == 1 ) {
      condition._id = {$nin : tmpSoldoutList};
    } else if ( soldoutType == 2 ) {
      condition._id = {$in : tmpSoldoutList};

    } else {

    }

    item.total(code, condition, function (err, count) {

      item.getList(code, condition, start, limit, function (err, result) {
        if (err) {
          return callback_(new error.InternalServer(err));
        }
        getItemSoldCount(code,soldoutType, result,tmpSoldoutList, function (err, itemWithTotal) {
          item.getList(code,condition,0,count, function(err,resultTag){
            var tags = [];
            for(var i in resultTag){
              tags = _.union(tags, resultTag[i].tags);
            }

            return callback_(err, {items: itemWithTotal, totalItems: count, tags :tags});
          });

        });
      });
    });


  });


};


function getItemSoldCount(code,soldoutType,itemList,soldoutResult,callback){
  var tmpResult = [];

  for(var i in itemList){
    itemList[i]._doc._index = i;
  }

  async.forEach(itemList,function(itemObj,cb){
    order.total(code,{itemId:itemObj._id},function(err,total){
      itemObj._doc.amount = total;


      if(soldoutResult.indexOf(itemObj._doc._id+"") > -1 ) {
        itemObj._doc.soldout = 2;
      } else {
        itemObj._doc.soldout = 1;
      }

      tmpResult[itemObj._doc._index] = itemObj;

      cb(err,total);
    });
  },function(err){
    callback(err,tmpResult);
  });
}


/**
 * 获取菜品一览
 * @param start_
 * @param limit_
 * @param callback
 */
exports.list = function(handler, callback_) {
  var code      = handler.params.code
    , start     = handler.params.start || 0
    , limit     = handler.params.count || 20
    , keyword   = handler.params.keyword
    , tags      = handler.params.tags
    , or      = handler.params.or
    , condition = {
      valid : 1
    };

  if (keyword) {
    keyword = util.quoteRegExp(keyword);
    condition.itemName = new RegExp(keyword.toLowerCase(), "i");
  }

  if (tags) {

    var or = [];
    _.each(tags.split(","), function(item){
      or.push({tags: item});
    });
    if(or){
      condition.$or = or;
    } else {
      condition.$in = or;
    }

  }

  item.total(code, condition, function (err, count) {

    item.getList(code, condition, start, limit,  function(err, result){
      if (err) {
        return callback_(new error.InternalServer(err));
      }
      item.getList(code,condition,0,count, function(err,resultTag){
        var tags = [];
        for(var i in resultTag){
          tags = _.union(tags, resultTag[i].tags);
        }

        return callback_(err, {items: result, totalItems: count, tags :tags});
      });

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
    , pin               : handler.params.pin
    , printerId         : handler.params.printerId
    , discount          : handler.params.discount
    , editat: now
    , editby: handler.uid
  };

  handler.params.tags = _.compact(handler.params.tags);

  var tasks = [];
    newItem.createat = now;
    newItem.createby = handler.uid;
  var tmpResult;
  tasks.push(function(cb){

    item.add(code, newItem, function(err, result){
      if (err) {
        return cb(new error.InternalServer(err));
      }

      tmpResult = result;
//      dimg.thumbImage(result.bigimage,"diandian","items","bigimageThumb",result._id+"");
//      dimg.thumbImage(result.smallimage,"diandian","items","smallimageThumb",result._id+"");
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

    return callback(err, tmpResult);
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
    , pin               : handler.params.pin
    , printerId         : handler.params.printerId
    , discount          : handler.params.discount
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
    , itemId = handler.params.id;

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
