/**
 * @file 存取文件
 * @author r2space@gmail.com
 * @copyright Dreamarts Corporation. All Rights Reserved.
 */

"use strict";

var context              = smart.framework.context
  , log                  = smart.framework.log
  , response             = smart.framework.response
  , file                 = require("../controllers/ctrl_file");

/**
 * 获取店铺摄影
 * @param req 请求对象
 * @param res 响应对象
 * @returns {*} 无
 */
exports.getImage = function(req, res) {

  var handler = new context().bind(req, res);

  log.operation("begin: get image.", handler.uid);
  file.getImage(handler, function(err, result) {

    log.operation("finish: get image.", handler.uid);
    response.sendFile(res, err, result);
  });
};
