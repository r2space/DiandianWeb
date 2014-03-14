/**
* Created by xiangrui.zeng@gmail.com on 14/01/15.
*/

var smart = require("smartcore");
var should = require('should');
var context = smart.framework.context
var Item = require("../../controllers/ctrl_item.js");

describe("../../controllers/ctrl_item.js", function () {
  var handler = new context().bind({uid: "52946dc7dc0ac8bb12000001" , lang: "ja"}, {});
  handler.addParams("start", 0);
  handler.addParams("limit", 20);
  handler.addParams("keyword", "");
  handler.addParams("tags", "test2,test1");
  handler.addParams("soldoutType", 2);
  handler.addParams("condition", {});
  handler.addParams("itemName", "test");
  handler.addParams("itemPriceNormal", "80");
  handler.addParams("itemPriceHalf", "50");
  handler.addParams("itemPriceDiscount", "30");
  handler.addParams("itemType", "");
  handler.addParams("itemComment", "test");
  handler.addParams("itemMaterial", "test");
  handler.addParams("itemMethod", "test");
  handler.addParams("bigimage", "52a15d916e9ab04017000009");
  handler.addParams("smallimage", "52a15d916e9ab04017000009");
  handler.addParams("type", 1);
  handler.addParams("pin", "52d37cf69bb3025f3b000008");
  handler.addParams("printerId", "1");

  var newItem = {
    itemName            : "name"
    , itemPriceNormal   : "80"
    , itemPriceHalf     : "50"
    , itemPriceDiscount : "30"
    , itemType          : ""
    , itemComment       : "test"
    , itemMaterial      : "test"
    , itemMethod        : "test"
    , bigimage          : "52a15d916e9ab04017000009"
    , smallimage        : "52a15d916e9ab04017000009"
    , tags              : ["test","test2"]
    , type              : 1
    , pin               : "52d37cf69bb3025f3b000008"
    , printerId         : "1"
  };
  var itemlist = {}
  it('should applist ok', function (done) {

    Item.appList(handler, function (err, item) {

      should.not.exist(err);
      itemlist = item;
      done();

    });
  });

  it('should add ok', function (done) {

    Item.add(handler, function (err, itemDocs) {
        should.not.exist(err);

//        should.not.exist(itemDocs);

        itemDocs.should.have.property('itemName', 'test');
      done();
    });

  });


  it('should list ok', function (done) {

    handler.addParams("tags", "");

      Item.list(handler, function (err, list) {
          should.not.exist(err);
          list.items.length.should.be.above(0);

          done();
      });

  });

//
//  it('should update ok', function (done) {
//    Item.update(handler, function (err, Item) {
//      should.not.exist(err);
//      Item.should.have.property('itemName', 'test');
//      done();
//    });
//
//  });
//
//  it('should remove ok', function (done) {
//
//    Item.remove(handler, function (err, Item) {
//      should.not.exist(err);
//
//      done();
//    });
//
//  });
//
//  it('should get ok', function (done) {
//
//    Item.get(handler, function (err, Item) {
//      should.not.exist(err);
//
//      done();
//    });
//
//  });


});

