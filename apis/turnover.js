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
exports.get = function(req,res){
  var handler = new context().bind(req, res);
  log.operation("begin: get turnover.", handler.uid);

  turnover.get(handler, function(err, result) {
    log.operation("finish: get turnover.", handler.uid);
    response.send(res, err, result);
  });
}

exports.analytics = function(req,res){
  var handler = new context().bind(req, res);
  log.operation("begin: analytics.", handler.uid);

  turnover.analytics(handler, function(err, result) {
    log.operation("finish: analytics.", handler.uid);
    response.send(res, err, result);
  });
}
exports.drinkRanking = function(req,res){
  var handler = new context().bind(req, res);
  log.operation("begin: drinkRanking.", handler.uid);

  turnover.drinkRanking(handler, function(err, result) {
    log.operation("finish: drinkRanking.", handler.uid);
    response.send(res, err, result);
  });
};

exports.itemRanking = function(req,res){

  var handler = new context().bind(req, res);
  log.operation("begin: itemRanking.", handler.uid);

  turnover.itemRanking(handler, function(err, result) {
    log.operation("finish: itemRanking.", handler.uid);
    response.send(res, err, result);
  });
};

exports.itemUserRanking = function(req,res){

  var handler = new context().bind(req, res);
  log.operation("begin: itemUserRanking.", handler.uid);

  turnover.itemUserRanking(handler, function(err, result) {
    log.operation("finish: itemUserRanking.", handler.uid);
    response.send(res, err, result);
  });
};