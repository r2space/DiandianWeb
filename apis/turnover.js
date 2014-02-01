var response  = smart.framework.response
  , errors    = smart.framework.errors
  , util      = smart.framework.util
  , context   = smart.framework.context
  , log       = smart.framework.log
  , _         = smart.util.underscore
  , turnover      = require("../controllers/ctrl_turnover.js");


exports.list = function(req,res){
  var handler = new context().bind(req, res);
  log.operation("begin: get turnover list.", handler.uid);

  turnover.list(handler, function(err, result) {
    log.operation("finish: get turnover list.", handler.uid);
    response.send(res, err, result);
  });
}