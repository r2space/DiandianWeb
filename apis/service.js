var response  = smart.framework.response
  , util      = smart.framework.util
  , errors    = smart.framework.errors
  , service   = require('../controllers/ctrl_service')
  , ws        = require('../ws/websocket')
  , act       = require('../ws/action');



exports.start = function(req_, res_) {

  var code = req_.session.user.companycode
    , deskId  = req_.body.deskId
    , userId  = req_.body.userId
    , type    = req_.body.type
    , people    = req_.body.people;


  service.startService(code,userId, deskId ,type,people, function(err, result) {
    //if(err)
    ws.broadcast(act.dataBroadcast("refresh_desk", {deskId:deskId}));
    response.send(res_, err, result);
  });

};