

"use strict";

var mongo       = smart.util.mongoose
  , conn        = smart.framework.connection
  , schema      = mongo.Schema;

var Schedule = new schema({

    people  : {type: String, description: "人数"}
  , phone  : {type: String, description: "电话"}
  , time  : {type: String, description: "时间"}
  , desk  : {type: String, description: "定桌"}

  , valid       : {type: Number, description: "删除 0:无效 1:有效", default: 1}
  , createat    : {type: Date,   description: "创建时间"}
  , createby    : {type: String, description: "创建者"}
  , editat      : {type: Date,   description: "最终修改时间"}
  , editby      : {type: String, description: "最终修改者"}
});

function model(code) {

  return conn.model(code, "Schedule", Schedule);
}

exports.add = function(code, newSchedule, callback) {

  var schedule = model(code);

  new schedule(newSchedule).save(function(err, result) {
    callback(err, result);
  });
};

exports.remove = function (code, uid, scheduleId, callback) {

  var schedule = model(code);

  schedule.findByIdAndUpdate(scheduleId, {valid: 0, editat: new Date(), editby: uid}, function(err, result) {
    callback(err, result);
  });
};

exports.getList = function(code, condition, start, limit, callback) {

  var schedule = model(code);

  schedule.find(condition)
    .skip(start || 0)
    .limit(limit || 20)
    .sort({time: 1})
    .exec(function(err, result) {
      callback(err, result);
    });
};
exports.total = function(code, condition, callback) {

  var schedule = model(code);

  schedule.count(condition).exec(function(err, count) {
    callback(err, count);
  });
};

