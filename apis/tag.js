/**
 * Created with JetBrains WebStorm.
 * User: ZengXR
 * Date: 11/25/13
 * Time: 1:43 PM
 * To change this template use File | Settings | File Templates.
 */

var response    = smart.framework.response
  , util        = smart.framework.util
  , errors      = smart.framework.errors
  , context   = smart.framework.context
  , log       = smart.framework.log
  , tag         = require('../controllers/ctrl_tag');

// Tag一览
exports.search = function(req, res) {
  var handler = new context().bind(req, res);
  log.operation("begin: search tags list", handler.uid);

  tag.search(handler, function(err, result) {
    log.operation("finish: search tags list", handler.uid)
    response.send(res, err, result);
  });
};

exports.appSearch = function(req,res){
  var handler = new context().bind(req, res);
  log.operation("begin: appSearch tags list", handler.uid);

  tag.appSearch(handler, function(err, result) {
    log.operation("finish: appSearch tags list", handler.uid)
    response.send(res, err, result);
  });
}