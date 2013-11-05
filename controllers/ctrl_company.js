/**
 * @file 存取公司信息的controllers
 * @author r2space@gmail.com
 * @copyright Dreamarts Corporation. All Rights Reserved.
 */

"use strict";

var _         = require('underscore')
  , sync      = require('async')
  , check     = require('validator').check
  , smart     = require("smartcore")
  , error     = smart.core.errors
  , user      = smart.ctrl.user
  , auth      = smart.core.auth
//  , device    = require('../controllers/ctrl_device')
  , company   = require('../modules/mod_company.js');

/**
 * 获取公司一览
 * @param start_
 * @param limit_
 * @param callback
 */
exports.list = function(start_, limit_, keyword ,callback) {

  var start = start_ || 0
    , limit = limit_ || 20
    , condition = { valid:1 };

  if (keyword) {
    condition.$or = [{ "name": new RegExp(keyword.toLowerCase(), "i") }];
  }

  // 获取件数
  company.total(condition, function(err, count) {
    if (err) {
      return callback(new error.InternalServer(err));
    }

    // 获取一览
    company.getList(condition, start, limit, function(err, result) {
      if (err) {
        return callback(new error.InternalServer(err));
      }

      return callback(err,  {totalItems: count, items:result});
    });
  });
};

//exports.companyListWithDevice = function(start_, limit_, callback){
//  exports.getList(start_, limit_, function(err, comps){
//    var task_getDeviceCount = function(comp_,subCB){
//      device.deviceTotalByComId(comp_._id.toString(),function(err,count){
//        comp_._doc.deviceCount = count;
//        user.userTotalByComId(comp_._id.toString(),function(err,ucount){
//          comp_._doc.userCount = ucount;
//          subCB(err);
//        });
//
//      });
//    };
//    sync.forEach(comps.items, task_getDeviceCount, function(err){
//      callback(err, comps);
//    });
//
//
//  });
//}

exports.searchOne = function( compid, callback_) {
    company.get(compid, function(err, result){
        if (err) {
            return callback_(new error.InternalServer(err));
        }
        return callback_(err, result);
    });

};

// 通过公司ID获取指定公司
exports.getByPath = function( path, callback_) {
  company.getByPath(path, function(err, result){
    if (err) {
      return callback_(new error.InternalServer(err));
    }
    return callback_(err, result);
  });

};
// 通过公司Code获取指定公司
exports.getByCode = function( code, callback_) {
  company.getByCode(code, function(err, result){
    if (err) {
      return callback_(new error.InternalServer(err));
    }
    return callback_(err, result);
  });

};

exports.add = function(uid_, data_, callback_) {

  try {
    /** 公司*/
    //会社名(かな)
    if (data_.body_company.kana != undefined) {
      check(data_.body_company.kana, __("js.ctr.check.company.kana.min")).notEmpty();
      check(data_.body_company.kana, __("js.ctr.check.company.kana.max")).notEmpty().len(1,30);
    }
    //会社名(英語)
    if (data_.body_company.name != undefined) {
//      check(data_.body_company.name, __("js.ctr.check.company.name.min")).notEmpty();
      check(data_.body_company.name, __("js.ctr.check.company.name.max")).len(0,30);
    }
    //会社ID
    if (data_.body_company.path != undefined) {
      check(data_.body_company.path, __("js.ctr.check.company.path.min")).notEmpty();
      check(data_.body_company.path, __("js.ctr.check.company.path.max")).len(0,20);
    }
    //会社住所
    if (data_.body_company.address != undefined) {
//      check(data_.body_company.address, __("js.ctr.check.company.address.min")).notEmpty();
      check(data_.body_company.address, __("js.ctr.check.company.address.max")).len(0,50);
    }
    //電話番号
    if (data_.body_company.tel != undefined) {
      check(data_.body_company.tel, __("js.ctr.check.company.tel")).len(0,30);
    }
    //有効性
    if (data_.body_company.active != undefined) {
      check(data_.body_company.active, __("js.ctr.check.company.active")).equals("1");
    }
    //
    /** 用户*/
    if (data_.body_user.userid != undefined) {
      check(data_.body_user.userid, __("js.ctr.check.company.user.uid.min")).notEmpty();
      check(data_.body_user.userid, __("js.ctr.check.company.user.uid.max")).notEmpty().len(3,30);
      check(data_.body_user.userid, __("js.ctr.check.company.user.uid.ismail")).notEmpty().isEmail();
    }

    if (data_.body_user.password != undefined) {
      check(data_.body_user.password, __("js.ctr.check.company.user.password.min")).notEmpty();
      check(data_.body_user.password, __("js.ctr.check.company.user.password.max")).notEmpty().len(1,20);
    }

  } catch (e) {
    return callback_(new error.BadRequest(e.message));
  }

  var comp_ = data_.body_company;
    comp_.createat = new Date();
    comp_.createby = uid_;
    comp_.editat = new Date();
    comp_.editby = uid_;

  var user_ = data_.body_user;
    user_.createat = new Date();
    user_.createby = uid_;
    user_.editat = new Date();
    user_.editby = uid_;

  sync.waterfall([
    function(callback) {
      // check path
      company.getByPath(comp_.path, function(err, result){
        if (err) {
          return  callback(new error.InternalServer(__("js.ctr.common.system.error")));
        }
        if (result) {
          return callback(new error.BadRequest(__("js.ctr.check.company.path")));
        } else {
          return callback(err);
        }
      });
    },
    // 添加公司
    function(callback) {
        company.add(comp_, function(err, result) {
            callback(err, result);

        });
    },
    // 添加用户
    function(result,callback) {
        user_.type = 1;
        user_.active = 1;
        user_.companyid = result.id;
        user_.companycode = result.code;
        user.addByDBName(user_.companycode, uid_, user_, function(err,resultuser){
            if (err) {
           //TODO  rollback未对应
            }
            callback(err, result);
        });
    }

    ], function(err, result) {
        callback_(err, result);
    });
};

/**
 * 更新指定公司
 * @param uid_
 * @param comp_
 * @param callback_
 * @returns {*}
 */
exports.update = function(uid_, data_, callback_) {
  try {
    /** 公司*/
    //会社名(かな)
    if (data_.body_company.kana != undefined) {
      check(data_.body_company.kana, __("js.ctr.check.company.kana.min")).notEmpty();
      check(data_.body_company.kana, __("js.ctr.check.company.kana.max")).notEmpty().len(1,30);
    }
    //会社名(英語)
    if (data_.body_company.name != undefined) {
//      check(data_.body_company.name, __("js.ctr.check.company.name.min")).notEmpty();
      check(data_.body_company.name, __("js.ctr.check.company.name.max")).len(0,30);
    }
    //会社ID
    if (data_.body_company.path != undefined) {
      check(data_.body_company.path, __("js.ctr.check.company.path.min")).notEmpty();
      check(data_.body_company.path, __("js.ctr.check.company.path.max")).len(0,20);
    }
    //会社住所
    if (data_.body_company.address != undefined) {
//      check(data_.body_company.address, __("js.ctr.check.company.address.min")).notEmpty();
      check(data_.body_company.address, __("js.ctr.check.company.address.max")).len(0,50);
    }
    //電話番号
    if (data_.body_company.tel != undefined) {
      check(data_.body_company.tel, __("js.ctr.check.company.tel")).len(0,30);
    }

  } catch (e) {
    return callback_(new error.BadRequest(e.message));
  }

  var comp_ = data_.body_company;
  comp_.editat = new Date();
  comp_.editby = uid_;

  // path check
  var pathcheck = comp_.path  ? comp_.path : "";
  company.find({path:pathcheck}, function(err, coms){
    if (err) {
      return  callback_(new error.InternalServer(__("js.ctr.common.system.error")));
    }
    if (coms.length > 0) {
      return callback_(new error.BadRequest(__("js.ctr.check.company.path")));
    } else {
      company.update(comp_.id, comp_, function(err, result){
        if (err) {
          return callback_(new error.InternalServer(err));
        }
        return callback_(err, result);
      });
    }
  });

};
exports.active= function(uid_, comp_, callback_) {
  comp_.editat = new Date();
  comp_.editby = uid_;
  var dbName = comp_.code;

  sync.waterfall([
    // 更新公司
    function(callback) {
      company.update(comp_.id,comp_, function(err, result) {
        callback(err, result);
      });
    },

    // 更新用户
    function(result,callback) {
      user.activeByDBName(dbName,uid_, comp_.active, function(err,rtn){
        callback(err, rtn);
      });
    }

  ], function(err, result) {
    callback_(err, result);
  });

};

