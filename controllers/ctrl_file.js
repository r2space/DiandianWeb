/**
 * @file 存取文件Controller
 * @author r2space@gmail.com
 * @copyright Dreamarts Corporation. All Rights Reserved.
 */

"use strict";

var file                   = smart.ctrl.file
  , constant               = smart.framework.constant
  , errors                 = smart.framework.errors
  , log                    = smart.framework.log
  , sync                   = smart.util.async;

/**
 * 获取图片
 * @param {Object} handler 上下文对象
 * @param {Function} callback 返回图片
 */
exports.getImage = function(handler, callback) {

  var uid = handler.uid
    , fixPhotoId = handler.params.id;

  handler.addParams("fileInfoId", fixPhotoId);
  handler.print(log.debug);

  file.get(handler, function(err, result) {
    if (err) {
      log.error(err, uid);
      return callback(new errors.NotFound("js.ctr.common.system.error"));
    } else {
      return callback(err, result);
    }
  });
};
