var desk  = require("../apis/desk")
  , service  = require("../apis/service")
  , menu  = require("../apis/menu");


exports.guiding = function(app){

  // APIs
  app.get('/api/menu/list.json', function(req, res){
    menu.setting(req, res);
  });
  app.get('/api/desk/list.json', function(req, res){
    desk.appDeskList(req, res);
  });
  app.post('/api/service/start.json', function(req, res){
    service.start(req, res);
  });


}


