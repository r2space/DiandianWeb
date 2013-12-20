var response  = smart.framework.response
  , util      = smart.framework.util
  , errors    = smart.framework.errors
  , context   = smart.framework.context
  , log       = smart.framework.log
  , ac      = require('../controllers/ctrl_ac');

exports.hasAdmin = function(req,res){
  var handler = new context().bind(req, res);
  log.operation("begin: hasAdmin.", handler.uid);

  ac.checkAdmin(handler,function(err,exist){
    log.operation("finish: hasAdmin.", handler.uid);

    if(exist === true) {
      response.send(res, err, "1");
    } else {
      response.send(res, err, "0");
    }
  });

}

exports.hasCash = function(req,res){
  var handler = new context().bind(req, res);
  log.operation("begin: hasAdmin.", handler.uid);

  ac.checkCash(handler,function(err,exist){
    log.operation("finish: hasAdmin.", handler.uid);

    if(exist === true) {
      response.send(res, err, "1");
    } else {
      response.send(res, err, "0");
    }
  });
}
