var desk = require("../apis/desk")
  , service = require("../apis/service")
  , seq = require("../apis/seq")
  , item = require("../apis/item")
  , order = require("../apis/order")
  , user = require("../apis/user")
  , device = require("../apis/device")
  , bill = require("../apis/bill")
  , schedule = require("../apis/schedule")
  , apn = require("../apis/apn")
  , printer = require("../apis/printer")
  , tag = require("../apis/tag")
  , soldout = require("../apis/soldout")
  , menu = require("../apis/menu")
  , turnover   = require("../apis/turnover")
  , file = require("../apis/file");


exports.guiding = function(app){

  // APIs
  app.get('/api/menu/list.json', function(req, res){
    menu.appList(req, res);
  });

  app.get('/api/desk/list.json', function(req, res){
    desk.appDeskList(req, res);
  });

  app.get('/api/item/list.json', function(req, res){
    item.appList(req, res);
  });

  //  /api/item/quickSearch.json?keyword=""
  app.get('/api/item/quickSearch.json', function(req, res){
    item.quickSearch(req, res);
  });

  app.get('/api/tag/list.json', function(req, res){
    tag.appSearch(req, res);
  });

//  /common/seq/initSeq.json?name=BillSEQ&start=0&increment=1

  app.get('/common/seq/initSeq.json', function(req, res){
    seq.initSeq(req, res);
  });
//http://115.28.161.172:3000/common/seq/resetSeq.json?name=BillSEQ&start=54
  app.get('/common/seq/resetSeq.json', function(req, res){
    seq.resetSeqSeq(req, res);
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

  //order
  app.get("/api/order/dishItemList.json" ,function(req,res){
    order.dishItemList(req,res);
  });

  app.get("/api/order/deskList.json" ,function(req,res){
    order.deskList(req,res);
  });

  app.get("/api/order/doneOrder.json" ,function(req,res){
    order.doneOrder(req,res);
  });

  app.get("/api/order/doneOrderAndGetDishOrderList.json" ,function(req,res){
    order.doneOrderAndGetDishOrderList(req,res);
  });

  app.get("/api/order/backOrder.json" ,function(req,res){
    order.backOrder(req,res);
  });

  app.post("/api/order/backOrder.json" , function(req,res){
    order.backOrder(req,res);
  });

  //免单
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

  app.get("/api/service/recentList.json" ,function(req,res){
    service.recentList(req,res);
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


  app.get("/api/test/apn.json" ,function(req,res){
    apn.testApn(req,res);
  });


  app.get("/api/printer/list.json" ,function(req,res){
    printer.list(req,res);
  });

  app.get("/api/printer/get.json" ,function(req,res){
    printer.findOne(req,res);
  });

  app.get('/api/printer/lock.json', function (req, res) {
    printer.lock(req,res);
  })

  app.post("/api/soldout/add.json", function(req,res){
    soldout.add(req,res);
  });
  app.post("/api/soldout/remove.json", function(req,res){
    soldout.remove(req,res);
  });


  app.post("/api/soldout/removeAll.json", function(req,res){
    soldout.removeAll(req,res);
  });

  app.get("/api/soldout/list.json", function(req,res){
    soldout.list(req,res);
  });

  app.post("/api/uploadLog.json", function(req,res){
    file.uploadLog(req,res);
  });

  app.get("/turnover/drinkRanking.json", function(req,res){
    turnover.drinkRanking(req,res);
  });
}


