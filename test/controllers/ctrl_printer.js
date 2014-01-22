/**
 * Created by xiangrui.zeng@gmail.com  on 14/01/21.
 */

var should = require('should');
var context = smart.framework.context
var Printer = require("../../controllers/ctrl_printer.js");

describe("../../controllers/ctrl_printer.js", function () {
  var handler = new context().bind({uid: "52946dc7dc0ac8bb12000001" , lang: "ja"}, {});
  handler.addParams("start", 0);
  handler.addParams("limit", 20);
  handler.addParams("keyword", "");
  handler.addParams("name", "test");
  handler.addParams("IP", "10.2.3.77");
  handler.addParams("type", 1);
  handler.addParams("need", 1);


  it('should list ok', function (done) {

    Printer.list(handler, function (err, Printer) {

      should.not.exist(err);
      Printer.should.have.property("name","test");
      Printer.should.have.property("IP","10.2.3.77");
      Printer.should.have.property("type",1);
      Printer.should.have.property("need",1);
      done();

    });
  });


  it('should add ok', function (done) {

    Printer.add(handler, function (err, Printer) {
      should.not.exist(err);
      Printer.should.have.property('name', 'test');
      done();
    });

  });

  it('should update ok', function (done) {
    Printer.update(handler, function (err, Printer) {
      should.not.exist(err);
      Printer.should.have.property('name', 'test');
      done();
    });

  });

  it('should remove ok', function (done) {

    Printer.remove(handler, function (err, Printer) {
      should.not.exist(err);

      done();
    });

  });

  it('should get ok', function (done) {

    Printer.get(handler, function (err, Printer) {
      should.not.exist(err);

      done();
    });

  });


});

