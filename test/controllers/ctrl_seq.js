//var should = require('should');
//var context = smart.framework.context
//var Seq = require("../../controllers/ctrl_seq.js");
//
//describe('../../controllers/ctrl_seq.js', function () {
//
////  var option = {
////    name: name,
////    value: start || 0,
////    start: start || 0,
////    increment: increment || 1,
////    maxvalue: maxvalue || 9999999,
////    cycle: cycle || 0
////  };
//  var orderSeqVal = 0;
//
//  it('should initSequence orderNum ok', function (done) {
//    Seq.initSequence(null, "orderNum", 1, 1, null, null, function (err, seq) {
//      should.not.exist(err);
//      done();
//    });
//
//
//  });
//
//  it('should initSequence orderSeq ok', function (done) {
//    Seq.initSequence(null, "orderSeq", 1, 1, null, null, function (err, seq) {
//      should.not.exist(err);
//      done();
//    });
//  });
//
//  it('should getNextVal orderSeq ok', function (done) {
//    Seq.getNextVal(null, "orderSeq", function (err, seq) {
//      should.not.exist(err);
//      console.log("orderSeq getNextVal :" + seq);
//      seq.should.be.above(0);
//      orderSeqVal = seq;
//      done();
//    });
//  });
//
//  it('should getCurrVal orderSeq ok', function (done) {
//    Seq.getCurrVal(null, "orderSeq", function (err, seq) {
//      should.not.exist(err);
//      console.log("orderSeq getCurrVal :" + seq);
//      seq.should.be.equal(orderSeqVal);
//      done();
//    });
//  });
//
//  it('should getNextVal no seq', function (done) {
//    Seq.getNextVal(null, "orderSeq1", function (err, seq) {
//      should.not.exist(err);
//      seq.should.have.property('err');
//      done();
//    });
//  });
//
//});
