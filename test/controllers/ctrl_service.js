var should  = require('should');
var context = smart.framework.context
var Service = require("../../controllers/ctrl_service.js");

describe('../../controllers/ctrl_service.js', function () {
  var handler = new context().bind({uid:"52946dc7dc0ac8bb12000001",lang:"ja"},{});
  var newCatalog = {

    name : "name" ,
    description : "description"
  };

  var newId;
  it('should startService ok', function (done) {


    Service.startService(handler,function(err,catalog){
      should.not.exist(err);
      //TODO ;
      done();
    });

  });

  it('should getTakeoutList ok', function (done) {


    Service.getTakeoutList(handler,function(err,list){
      should.not.exist(err);
      //TODO ;
      done();
    });

  });
});