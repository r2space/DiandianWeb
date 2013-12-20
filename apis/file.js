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

function createErrorSchema(errCode, errMessage, errorDetail) {
  return {
    apiVersion: "1.0"
    , error: {
      code: errCode
      , message: errMessage
      , errors: errorDetail
    }
  };
}
/**
 * 获取店铺摄影
 * @param req 请求对象
 * @param res 响应对象
 * @returns {*} 无
 */
exports.getImage = function(req, res) {

  var handler = new context().bind(req, res);

  log.operation("begin: get image.", handler.uid);

  file.getImage(handler, function(error, data) {


    // 返回错误信息
    if (error) {
      return res.send(error.code, createErrorSchema(error.code, error.message));
    }
    res.setHeader("Content-Type", data.fileInfo.contentType);
    res.setHeader("Content-Length", data.fileInfo.length);

    // 返回JSON数据
    var expires = new Date();
    expires.setTime(expires.getTime() + 60 * 60 * 24 * 365 * 1000);
//    res.setHeader("Expires", expires.toUTCString());
//    res.setHeader("Cache-Control", "public, max-age=" + 60 * 60 * 24 * 365);
    res.setHeader("Cache-Control", "public, max-age=0");
    res.setHeader("Last-Modified", data.fileInfo.updateAt);
    return res.send(data.fileData);
  });
};
