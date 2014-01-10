var should = require('should');
var context = smart.framework.context
var Order = require("../../controllers/ctrl_order.js");


describe('../../controllers/ctrl_order.js', function () {
  var handler = new context().bind({uid: "52946dc7dc0ac8bb12000001", lang: "ja"}, {});
  var now = new Date();
  var newOrder = {
      deskId      : "deskId"
    , serviceId   : "serviceId"
    , orderSeq    : "orderSeq"
    , orderNum    : "orderNum"
    , itemType    : ""
    , userId      : "52946dc7dc0ac8bb12000001"
    , itemId      : "52946dc7dc0ac8bb12000001"
    , type        : "1"
    , remark      : "1"
    , createat    : now
    , createby    : "52946dc7dc0ac8bb12000001"
    , editat      : now
    , editby      : "52946dc7dc0ac8bb12000001"
  };
  it('should add ok', function (done) {

    Order.add(null, "52946dc7dc0ac8bb12000001", newOrder, function (err, order) {
      should.not.exist(err);
      //TODO: item add
      order.should.have.property('deskId', 'deskId');
      done();
    });

  });

  it('should getList ok', function (done) {

    Order.getList(null, null, null,0, 0, 20, function (err, list) {
      should.not.exist(err);
      list.items.length.should.be.above(0);
      done();
    });

  });

  it('should getList ok', function (done) {
    var orderList = [];
    orderList.push(newOrder);
    handler.addParams("orderList",orderList);
    Order.addOrder(handler, function (err, list) {
      should.not.exist(err);
      list.items.length.should.be.above(0);
      done();
    });

  });


});