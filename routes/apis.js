var desk      = require("../apis/desk")
  , service   = require("../apis/service")
  , seq       = require("../apis/seq")
  , order     = require("../apis/order")
  , menu      = require("../apis/menu");


exports.guiding = function(app){

  // APIs
  app.get('/api/menu/list.json', function(req, res){
    menu.appList(req, res);
  });

  app.get('/api/desk/list.json', function(req, res){
    desk.appDeskList(req, res);
  });

  app.get('/common/seq/initSeq.json', function(req, res){
    seq.initSeq(req, res);
  });
  app.get('/common/seq/currVal.json', function(req, res){
    seq.currVal(req, res);
  });
  app.get('/common/seq/nextVal.json', function(req, res){
    seq.nextVal(req, res);
  });

  app.post('/api/service/start.json', function(req, res){
    service.start(req, res);
  });


  //order
  app.get("/api/order/list.json" ,function(req,res){
    order.list(req,res);
  });


}


