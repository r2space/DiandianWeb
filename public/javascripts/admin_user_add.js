$(function () {
  'use strict';

  //取得用户ID
  var userid =  $('#userId').val();
  var code =  $('#code').val();
  //画面表示
  render(userid,code);
  //事件追加
  $("#updateUser").bind("click", function(event){
    //取得用户信息
    var user = getUserData();

    if (userid && userid.length > 0) {
      //编集用户
      user.id = userid;    //编集用户ID
      updateUser(user)
    } else {
      //添加用户
      user.type = 0;      //普通用户
      addUser(user);
    }
    return false;
  });

});

//画面表示
function render(userid, code) {
  if (userid) {
//    smart.doget("/admin/user/findOne.json?code=" + code + "&userid=" + userid, function(err, result) {
//      if (err) {
//        smart.error(err,i18n["js.common.search.error"],false);
//      } else {
//        if (result) {
//          $("#inputUserID").val(result.uid);
//          $("#inputUserID").attr("disabled","disabled");
//          $("#inputPassword").val(result.password);
//          $("#inputPassword").attr("oldpass",result.password);
//          $("#inputName").val(result.name ? result.name.name_zh:"");
//          $("#inputRole").val(result.title);
//          $("#inputPhone").val(result.tel ? result.tel.telephone:"");
//          $("#inputComment").val(result.description);
//          $("#inputCompanyCode").val(result.companypath)
//          $("#inputCompanyCode").attr('code',result.companycode);
//          $("#inputCompanyCode").attr("disabled","disabled");
//
//          var inputLang = result.lang;
//          new ButtonGroup("inputLang", inputLang).init();
//          var inputTimezone = result.timezone;
//          new ButtonGroup("inputTimezone", inputTimezone).init();
//          var inputContents = result.authority && result.authority.contents == 1 ? "1" : "0";
//          new ButtonGroup("inputContents", inputContents).init();
//          var inputActive = result.active == 1 ? "1" : "0";
//          new ButtonGroup("inputActive", inputActive).init();
//        }
//      }
//
//    });
    new ButtonGroup("inputUserType", "0").init();
    new ButtonGroup("inputActive", "1").init();
  } else {
    new ButtonGroup("inputUserType", "0").init();
    new ButtonGroup("inputActive", "1").init();
  }
}

//取得用户信息
function getUserData() {

  var user = {
    userid : $("#inputUserID").val()
    , name: {
      name_zh:$("#inputName").val()
    }
    , title: $("#inputRole").val()
    , tel: {
      telephone:$("#inputPhone").val()
    }
    , "description": $("#inputComment").val()
    , "timezone": $("#inputTimezone").attr('value')
    , "lang": $("#inputLang").attr('value')
    , "companycode" :$("#inputCompanyCode").attr('code')
  };

  //编集时,如果密码没有变更,不提交密码.
  if ($("#inputPassword").val() != $("#inputPassword").attr("oldpass")) {
    user.password = $("#inputPassword").val();
  }
  //Contents作成者,有效在画面不表示时,不指定值.
  if ($("#inputContents").size() > 0) {
    var contents = $("#inputContents").attr('value');
    user.authority = user.authority || {};
    user.authority.contents = contents;
  }

  if ($("#inputActive").size() > 0) {
    var active = $("#inputActive").attr('value');
    user.active = active;
  }
  return user;
}

//添加用户
function addUser(user) {
  smart.dopost("/admin/user/add.json", user, function(err, result) {
    if (err) {
      smart.error(err,i18n["js.common.add.error"],false);
    } else {
      window.location = "/admin/user";
    }
  });
}

//更新用户
function updateUser(user) {
  smart.doput("/admin/user/update.json", user, function(err, result){
    if (err) {
      smart.error(err,i18n["js.common.update.error"],false);
    } else {
      window.location = "/admin/user";
    }
  });
}
