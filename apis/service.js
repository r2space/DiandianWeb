var smart  = require("smartcore")
  , response    = smart.framework.response
  , util    = smart.framework.util
  , errors  = smart.core.errors
  , service    = require('../controllers/ctrl_service');



exports.start = function(req_, res_) {

  var code = req_.session.user.companycode
    , deskId  = req_.body.deskId
    , userId  = req_.body.userId
    , type    = req_.body.type
    , people    = req_.body.people;


  service.startService(code,userId, deskId ,type,people, function(err, result) {
    response.send(res_, err, result);
  });

};