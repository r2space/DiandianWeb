var desk      = require("../apis/desk")
  , service   = require("../apis/service")
  , seq       = require("../apis/seq")
  , order     = require("../apis/order")
  , user      = require("../apis/user")
  , device      = require("../apis/device")
  , bill      = require("../apis/bill")
  , schedule      = require("../apis/schedule")
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
    order.appList(req,res);
  });


  //order
  app.get("/api/order/itemList.json" ,function(req,res){
      order.itemList(req,res);
  });

  app.get("/api/order/deskList.json" ,function(req,res){
    order.deskList(req,res);
  });

  app.get("/api/order/doneOrder.json" ,function(req,res){
    order.doneOrder(req,res);
  });

  app.get("/api/order/backOrder.json" ,function(req,res){
    order.backOrder(req,res);
  });

  app.post("/api/order/backOrder.json" , function(req,res){
    order.backOrder(req,res);
  });

  app.post("/api/order/freeOrder.json" , function(req,res){
    order.freeOrder(req,res);
  });

  app.get("/api/user/list.json" ,function(req,res){
    user.getList(req, res);
  });

  app.get("/api/bill/get.json" ,function(req,res){
    bill.createBill(req,res);
  });

  app.post("/api/bill/stop.json" ,function(req,res){
    bill.stopBill(req,res);
  });

  app.get("/api/bill/orderList.json" ,function(req,res){

  });

  app.post("/api/device/add.json" ,function(req,res){
    device.deviceRegister(req,res);
  });

  app.post('/api/admin/user/updatePattern.json', function (req, res) {
    user.updatePattern(req, res);
  });

  app.post('/api/admin/user/checkPattern.json', function (req, res) {
    user.isPatternRight(req, res);
  });

  app.post('/api/service/change.json', function (req, res) {
    service.changeDesk(req, res);
  });



  app.get("/api/service/takeoutList.json" ,function(req,res){
    service.takeoutList(req,res);
  });

  app.post('/api/order/add.json', function (req, res) {
    order.orderAdd(req, res);
  });


  app.post('/api/schedule/add.json', function (req, res) {
    schedule.addSchedule(req, res);
  });

  app.get("/api/schedule/list.json" ,function(req,res){
    schedule.getList(req,res);
  });

  app.post('/api/schedule/remove.json', function (req, res) {
    schedule.removeSchedule(req, res);
  });


}


