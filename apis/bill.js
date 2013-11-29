var response  = smart.framework.response
  , util      = smart.framework.util
  , errors    = smart.framework.errors
  , context   = smart.framework.context
  , log       = smart.framework.log
  , bill      = require('../controllers/ctrl_bill')
  , menu      = require('../controllers/ctrl_menu');

exports.createBill = function(req_, res_) {


  var handler = new context().bind(req, res);
  log.operation("begin: get menu list.", handler.uid);

  bill.createBill(handler, function(err, result) {

    log.operation("finish: get menu list.", handler.uid);
    response.send(res, err, result);
  });

};