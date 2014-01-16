//var should  = require('should');
//var context = smart.framework.context
//var Turnover = require("../../controllers/ctrl_turnover.js");
//
//describe('../../controllers/ctrl_turnover.js', function () {
//  var handler = new context().bind({uid:"52946dc7dc0ac8bb12000001",lang:"ja"},{});
//
//  it('should list ok', function (done) {
//
//    handler.addParams("start",0);
//    handler.addParams("count",20);
//    Turnover.list(handler,function(err,list){
//      should.not.exist(err);
//
//      done();
//    });
//
//  });
//
//  it('should list with time  ok', function (done) {
//
//    handler.addParams("start",0);
//    handler.addParams("count",20);
//
//    handler.addParams("startTime","2013-12-30");
//    handler.addParams("endTime","2014-01-16");
//
//    Turnover.list(handler,function(err,list){
//      should.not.exist(err);
////      list.items.length.should.be.above(0);
//      done();
//    });
//
//  });
//
//});