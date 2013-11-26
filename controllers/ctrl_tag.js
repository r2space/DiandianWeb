/**
 * Created with JetBrains WebStorm.
 * User: ZengXR
 * Date: 11/25/13
 * Time: 1:34 PM
 * To change this template use File | Settings | File Templates.
 */

var _         = require('underscore')
  , tag       = require('../modules/mod_tag.js')
  , async     = require('async');

/**
 * 给tag进行分类（如素材的tag，组的tag等），暂时没有使用
 * @type {string}
 */
var default_scope = "default";

exports.add = function (code_, uid_, name_, callback_) {

  var tags = _.isArray(name_) ? name_ : [name_];

  async.forEach(tags, function(data, cb){

    var object = {
      uid: uid_
      , scope: default_scope
      , name: data
    }

    tag.add(code_, object, function(err, result){
      cb(err, result);
    });

  }, function (err) {
    callback_(err);
  });

}

exports.remove = function (code_, uid_, name_, callback_) {

  var tags = _.isArray(name_) ? name_ : [name_];

  async.forEach(tags, function(data, cb){

    var object = {
      uid: uid_
      , scope: default_scope
      , name: data
    }

    tag.remove(code_, object, function(err, result){
      cb(err, result);
    });

  }, function (err) {
    return callback_(err);
  });
}

exports.search = function(code_, keywords_, start_, limit_, callback_){

  var object = { scope: default_scope };

  if (keywords_) {
    object.name = new RegExp("^" + keywords_.toLowerCase() + ".*$", "i");
  }

  tag.getList(code_, object, start_, limit_, function(err, result){
    return callback_(err, result);
  });
}