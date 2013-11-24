$(function () {
  'use strict';

  //画面表示
  render();

  //事件追加
  events();

});

//画面表示
function render() {

  var uid = $("#uid").val();
  if(uid) { // 更新

    smart.doget("/admin/user/get.json?uid=" + uid , function(err, result) {
      if (err) {
        smart.error(err, i18n["js.common.search.error"], false);
      } else {
        // ID
        $("#inputID").val(result.id);
        $("#inputID").attr("disabled", true);
        // 密码
        $("#inputPassword").val("000000000000");
        // 姓名
        $("#inputRealName").val(result.realName);
        // 性别
        new ButtonGroup("inputSex", result.sex).init();
        initDateSelect();
        // 出生年月日
        var birthday = result.birthday; //
        $("#inputBirthYear").val(birthday.substring(0, 4));
        $("#inputBirthMonth").val(birthday.substring(4, 6));
        $("#inputBirthDay").val(birthday.substring(6, 8));
        // 入职日期
        var entryDate = result.entryDate; //
        $("#inputEntryYear").val(entryDate.substring(0, 4));
        $("#inputEntryMonth").val(entryDate.substring(4, 6));
        $("#inputEntryDay").val(entryDate.substring(6, 8));
        // 手机号码
        $("#inputCellPhone").val(result.cellphone);
        // 备注
        $("#inputRemark").val(result.remark);
      }
    });

  } else { // 添加

    initDateSelect()
    new ButtonGroup("inputSex", "1").init();
  }

}

function events() {
  $("#saveUser").click(saveUser);
  $("#removeUser").click(removeUser);
}

function initDateSelect() {
  // 出生年月日
  var date = new Date();
  var year = $("#inputBirthYear");
  for(var i = date.getFullYear() - 16; i >= 1950; i--) {
    year.append("<option>" + i + "</option>");
  }
  var month = $("#inputBirthMonth");
  for(var i = 1; i <=12; i++) {
    month.append("<option>" + i + "</option>");
  }
  var day = $("#inputBirthDay");
  for(var i = 1; i <= 31; i++) {
    day.append("<option>" + i + "</option>");
  }

  // 入职日期
  var year = $("#inputEntryYear");
  for(var i = date.getFullYear(); i >= 1950; i--) {
    year.append("<option>" + i + "</option>");
  }
  var month = $("#inputEntryMonth");
  for(var i = 1; i <=12; i++) {
    month.append("<option>" + i + "</option>");
  }
  month.val(date.getMonth() + 1);
  var day = $("#inputEntryDay");
  for(var i = 1; i <= 31; i++) {
    day.append("<option>" + i + "</option>");
  }
  day.val(date.getDate());
}

//保存用户
function saveUser() {

  var user = {};

  // ID
  user.id = $("#inputID").val();
  // 密码
  user.password = $("#inputPassword").val();
  // 姓名
  user.realName = $("#inputRealName").val();
  // 性别
  user.sex = $("#inputSex").val();
  // 出生年月日
  user.birthday = $("#inputBirthYear").val() + $("#inputBirthMonth").val() + $("#inputBirthDay").val();
  // 入职日期
  user.entryDate = $("#inputEntryYear").val() + $("#inputEntryMonth").val() + $("#inputEntryDay").val();
  // 手机号码
  user.cellphone = $("#inputCellPhone").val();
  // 备注1
  user.remark = $("#inputRemark").val();

  if(user.id == "") {
    Alertify.log.error("ID不能为空！");
    $("#inputID").focus();
    return;
  }

  if(user.password == "") {
    Alertify.log.error("密码不能为空！");
    $("#inputPassword").focus();
    return;
  }

  var uid = $("#uid").val();
  if(uid) { // 更新
    user.uid = uid;
    smart.dopost("/admin/user/update.json", user, function(err, result) {
      if (err) {
        smart.error(err, i18n["js.common.add.error"], false);
      } else {
        window.location = "/admin/users";
      }
    });
  } else { // 添加
    smart.dopost("/admin/user/add.json", user, function(err, result) {
      if (err) {
        smart.error(err, i18n["js.common.add.error"], false);
      } else {
        window.location = "/admin/users";
      }
    });
  }
}

function removeUser() {
  smart.doget("/admin/user/remove.json?uid=" + $("#uid").val(), function(err, result) {
    if (err) {
      smart.error(err, i18n["js.common.add.error"], false);
    } else {
      window.location = "/admin/users";
    }
  });
}
