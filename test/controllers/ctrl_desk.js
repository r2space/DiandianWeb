var should = require('should');
var context = smart.framework.context
var Desk = require("../../controllers/ctrl_desk.js");


describe('../../controllers/ctrl_desk.js', function () {
  var handler = new context().bind({uid: "52946dc7dc0ac8bb12000001", lang: "ja"}, {});
  var newDesk = {
    name: "name",
    type: 1,
    capacity: "10",
    sortLevel: 10
  };
  var newId = "";
  it('should add ok', function (done) {


    Desk.add(null, "52946dc7dc0ac8bb12000001", newDesk, function (err, desk) {

      should.not.exist(err);
      desk.should.have.property('name', 'name');
      newId = desk._id;
      done();

    });
  });
  it('should get ok', function (done) {
    console.log("find get  desk  _id : "+ newId);
    Desk.get(null, "52946dc7dc0ac8bb12000001", newId +"", function (err, desk) {
      should.not.exist(err);
      desk.should.have.property('name', 'name');
      done();
    });

  });

  it('should update ok', function (done) {
    console.log("find get  update  _id : "+ newId);
    newDesk.id = newId;
    newDesk.name = "update";
    Desk.add(null, "52946dc7dc0ac8bb12000001", newDesk, function (err, desk) {
      should.not.exist(err);
      desk.should.have.property('name', 'update');
      done();
    });

  });

  it('should list ok', function (done) {

    Desk.list(null, {valid:1}, 0,20, function (err, list) {
      should.not.exist(err);
      list.items.length.should.be.above(0);

      done();
    });

  });

  it('should appList ok', function (done) {

    Desk.appList(null, {valid:1}, 0,20, function (err, list) {
      should.not.exist(err);
      list.items.length.should.be.above(0);
      done();
    });

  });


  it('should remove ok', function (done) {

    Desk.remove(null, "52946dc7dc0ac8bb12000001", newId +"", function (err, desk) {
      should.not.exist(err);

      done();
    });

  });


});