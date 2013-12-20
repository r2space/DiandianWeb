var response  = smart.framework.response
  , errors    = smart.framework.errors
  , util      = smart.framework.util
  , context   = smart.framework.context
  , log       = smart.framework.log
  , _         = require('underscore')
  , filter    = require("../controllers/ctrl_filter");

// 获取过滤一览
exports.list = function(req, res) {

  var handler = new context().bind(req, res);
  log.operation("begin: get item list.", handler.uid);

  filter.list(handler, function(err, result) {

    log.operation("finish: get item list.", handler.uid);
    response.send(res, err, result);

  });

};


exports.add = function(){

}

exports.remove = function(){

}
