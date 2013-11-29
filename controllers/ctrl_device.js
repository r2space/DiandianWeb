/**
 * Created with JetBrains WebStorm.
 * User: ZengXR
 * Date: 11/25/13
 * Time: 10:55 AM
 * To change this template use File | Settings | File Templates.
 */

var async     = smart.util.async
  , _         = smart.util.underscore
  , user      = smart.ctrl.user
  , error     = smart.framework.errors
  , auth      = smart.framework.auth
  , util      = smart.framework.util
  , device    = require('../modules/mod_device.js')

var that_device = device;
exports.lang = '';
exports.timezone = '';

exports.setUserDefault = function (lang_, timezone_) {
  exports.lang = lang_;
  exports.timezone = timezone_;
};

/**
 * 获取设备一览
 * @param start_
 * @param limit_
 * @param callback_
 */
exports.list = function (code, start_, limit_, callback_) {

  var start = start_ || 0
    , limit = limit_ || 20
    , condition = {
      valid: 1
    };
  device.total(code, function (err, count) {
    if (err) {
      return callback_(new error.InternalServer(err));
    }
    device.getListByPage(code, condition, start, limit, function (err, result) {
      console.log(err);
      if (err) {
        return callback_(new error.InternalServer(err));
      }
      return callback_(err, {totalItems: count, items: result});
    });
  });
};

//允许禁止  设备
exports.deviceallow = function (code, session_uid, device_, allow_, callback_) {
  checkDeviceId(code, device_, function (err, device_docs) {
    var docs = undefined;
    if (err) {
      return callback_(null, 0);
    }
    if (device_docs) {
      docs = device_docs instanceof Array ? device_docs[0] : docs;
    } else {
      return callback_(null, 0);
    }


    var device_update = {
      devstatus: allow_ ? "1" : "0"
    }

    device.update(code, docs._id, device_update, function (err, result) {
      callback_(err, result);
    });


  });
}

/**
 * 添加设备
 */
exports.add = function (code, deviceid, user, description, devicetype, confirm, callback_) {

  // check device & user exists
  device.getList(code, {"deviceid": deviceid}, function (err, result) {

    if (result && result.length > 0) {

      // 如果存在用户，则返回用户的申请状态
      var d = result[0];
      var info = _.find(d.userinfo, function (u) {
        return u.userid == user.uid;
      });
      if (info) {
        return callback_(null, {status: info.status});
      }

      // 如果仅仅是确认，则当没有数据的时候返回为申请的状态
      if (confirm) {
        return callback_(null, {status: "3"});
      }

      // 否则给设备添加一个用户
      var object = {
        $push: {"userinfo": {"userid": user.uid, "status": "2"}}, editat: new Date(), editby: user.uid
      }
      console.log(d._id);
      console.log(object);
      // 更新
      device.update(code, d._id, object, function (err, result) {
        console.log(err);
        return callback_(err, {status: "2"});
      });

      // 新规
    } else {

      // 如果仅仅是确认，则当没有数据的时候返回为申请的状态
      if (confirm) {
        return callback_(null, {status: "3"});
      }

      var object = {
        "companycode": "diandian", "deviceid": deviceid, "deviceType": devicetype, "devstatus": 1, "userinfo": [
          {
            "userid": user.uid, "status": "2"
          }
        ], "description": description, createat: new Date(), createby: user.uid, editat: new Date(), editby: user.uid
      }
      device.add(code, object, function (err, result) {
        return callback_(err, {status: "2"});
      });
    }
  });

};

//
exports.deviceTotalByComId = function (code, compId_, callback_) {
  device.totalByComId(code, compId_, function (err, result) {
    if (err) {
      return callback_(new error.InternalServer(err));
    }
    return callback_(err, result);
  });
};

exports.allow = function (code, session_uid, device_, user_id, allow_, callback_) {
  // 初始化密码为邮件(user_id) 中"@"之前的字符
  /^(.*)@.*$/.test(user_id);
  var pass = RegExp.$1 == "" ? user_id : RegExp.$1;
  //pass = auth.sha256(pass);
  findApply(code, device_, user_id, function(err,result){

    updateAllow(code, session_uid, result.deviceid, user_id, allow_, pass, function (err, result) {
      callback_(err, result);
    });
  });


};

exports.setDeviceUser = function (code_, userid_, deviceid_, callback_) {
  var query = {deviceid: deviceid_};
  var obj = {
    deviceid: deviceid_,
    deviceuid: userid_
  };

  device.getAndUpdate(code_, query, obj, function (err, result) {
    callback_(err, result);
  });

}

function checkDeviceId(code, deviceid, callback) {
  device.getList(code, {"deviceid": deviceid}, function (err, result) {
    if (result && result.length > 0) {
      callback(null, result);
    } else {
      callback(null, null);
    }
  });
};

//查找用户的申请
function findApply(code, deviceid, userid, callback_) {
  var query = {deviceid: deviceid, "userinfo.userid": userid, companycode: code, valid: 1};
  console.log(query);
  device.getList(code, query, function (err, result) {
    if (result && result.length > 0) {
      callback_(err, result[0]);
    } else {
      callback_(null, null);
    }
  });
}

//许可
function updateAllow(code, session_uid, device_id, user_id, allow_, pass, callbak_) {

  updateApplyFn(code, session_uid, device_id, user_id, allow_,function (update_apply) {
    callbak_(null, "allow");
  });


};

//调用许可设备接口
function updateApplyFn(code, session_uid, device_id, user_id, allow_, callback_) {


  device.allow(code, session_uid, device_id, user_id, allow_, function (err, result) {
    if (!err) {
    }
    return callback_(err, result);
  });


}

exports.deviceRegister = function (deviceid, devicetoken, userid, code, devicetype, callback_) {
  var object = {
    "companycode":code, "devicetoken": devicetoken, "deviceid": deviceid, "deviceType": devicetype, "devstatus": 1, "userinfo": [
      {
        "userid": userid, "status": 0
      }
    ], createat: new Date(), createby: userid, editat: new Date(), editby: userid
  }
  device.add(code, object, function (err, result) {
//        console.log("device.add");
//        console.log(result);
    return callback_(err, result);
  });
};

