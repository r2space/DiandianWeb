var should = require('should');
var context = smart.framework.context
var Order = require("../../controllers/ctrl_order.js");
var Service = require("../../controllers/ctrl_service.js");
var ModService = require("../../modules/mod_service.js");


describe('../../controllers/ctrl_order.js', function () {
  var handler = new context().bind({uid: "52957c8b8218a3f00d000003", lang: "ja"}, {});
  var now = new Date();
  var newService = {
    "deskId" : "52a154e57c82db700d000004",
    "people" : 6,
    "type" : 1,
    "phone" : "0",
    "status" : 1,
    "unfinishedCount" : 0,
    "createat" : now,
    "createby" : "52957c8b8218a3f00d000003",
    "editat" : now,
    "editby" : "52957c8b8218a3f00d000003"
  };
//  it('should service add ok', function (done) {
//
//    ModService.add(null, newService , function (err, order) {
//      should.not.exist(err);
//      //TODO: item add
//      order.should.have.property('deskId', '52a154e57c82db700d000004');
//      done();
//    });
//
//  });

  var newOrder1 = {
    deskId: '52a154e57c82db700d000004',
    serviceId: '52d4c08ab18443500b000004',
    itemType: 1,
    userId: '52957c8b8218a3f00d000003',
    itemId: '52a161306e9ab0401700003d',
    type: 0,
    remark: undefined,
    createat: now,
    createby: '',
    editat: now,
    editby: '',
    amount: '2'
  }

  var newOrder2 = {
    deskId: '52a154e57c82db700d000004',
    serviceId: '52d4c08ab18443500b000004',
    itemType: 1,
    userId: '52957c8b8218a3f00d000003',
    itemId: '52a1620efabde67819000008',
    type: 0,
    remark: undefined,
    createat: now,
    createby: '',
    editat: now,
    editby: '',
    amount: '2'
  }

  var newOrder3 = {
    deskId: '52a154e57c82db700d000004',
    serviceId: '52d4c08ab18443500b000004',
    itemType: 1,
    userId: '52957c8b8218a3f00d000003',
    itemId: '52a1620efabde67819000008',
    type: 0,
    remark: undefined,
    createat: now,
    createby: '',
    editat: now,
    editby: '',
    amount: '2'
  }

  it('should add ok', function (done) {
    var orderList = [];
    orderList.push(newOrder1);
    orderList.push(newOrder2);
    orderList.push(newOrder3);

    handler.addParams("orderList",orderList);
    handler.addParams("deskId","52a154e57c82db700d000004");
    Order.addOrder(handler, function (err, order) {
      console.log(err);
      should.not.exist(err);

      done();
    });

  });


  it('should add ok', function (done) {

    var orderList = [];
    orderList.push({_id:""});
    orderList.push(newOrder2);
    orderList.push(newOrder3);



  });


//  it('should add ok', function (done) {
//
//  });
//

//
//  var newOrder = {
//      deskId      : "52a029e9acdd771e56000004"
//    , serviceId   : "serviceId"
//    , orderSeq    : "orderSeq"
//    , orderNum    : "orderNum"
//    , itemType    : ""
//    , userId      : "52946dc7dc0ac8bb12000001"
//    , itemId      : "52946dc7dc0ac8bb12000001"
//    , type        : "1"
//    , remark      : "1"
//    , createat    : now
//    , createby    : "52946dc7dc0ac8bb12000001"
//    , editat      : now
//    , editby      : "52946dc7dc0ac8bb12000001"
//  };
//  it('should add ok', function (done) {
//
//    Order.add(null, "52946dc7dc0ac8bb12000001", newOrder, function (err, order) {
//      should.not.exist(err);
//      //TODO: item add
//      order.should.have.property('deskId', 'deskId');
//      done();
//    });
//
//  });



});