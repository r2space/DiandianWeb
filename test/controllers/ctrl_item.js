/**
 * Created by xiangrui.zeng@gmail.com on 14/01/15.
 */

var should = require('should');
var context = smart.framework.context
var Item = require("../../controllers/ctrl_item.js");

describe("../../controllers/ctrl_item.js", function () {
  var handler = new context().bind({code: null
    ,uid: "52946dc7dc0ac8bb12000001"
    , lang: "ja"
    , start: 0
    , limit: 20
    , keyword: ""
    , tags: null}, {});
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
    , tags              : ["test"]
    , type              : 1
    , pin               : "52d37cf69bb3025f3b000008"
    , printerId         : "1"
  };
  var itemlist = {}
  it('should applist ok', function (done) {


    Item.applist(handler, function (err, item) {

      should.not.exist(err);
      itemlist = item;
      done();

    });
  });

  it('should update ok', function (done) {
    console.log("find get  update  _id : "+ newId);
    newItem.id = newId;
    newItem.name = "update";
    Item.add(handler, newItem, function (err, Item) {
      should.not.exist(err);
      Item.should.have.property('name', 'update');
      done();
    });

  });

  it('should list ok', function (done) {

    Item.list(handler, function (err, list) {
      should.not.exist(err);
      list.items.length.should.be.above(0);

      done();
    });

  });



  it('should remove ok', function (done) {

    Item.remove(handler, function (err, Item) {
      should.not.exist(err);

      done();
    });

  });


});

