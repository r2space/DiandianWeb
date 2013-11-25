$(function () {
  'use strict';

  //画面表示
  render();

  //事件追加
  events();

});

var dateDelimiter = "-";

//画面表示
function render() {

  var userId = $("#userId").val();
  if(userId) { // 更新

    smart.doget("/admin/user/get.json?userId=" + userId , function(err, result) {
      if (err) {
        smart.error(err, i18n["js.common.search.error"], false);
      } else {
        // ID
        $("#inputID").val(result.id);
        $("#inputID").attr("disabled", true);
        // 密码
        $("#inputPassword").val("000000000000");
        // 姓名
        $("#inputName").val(result.name);
        // 性别
        new ButtonGroup("inputSex", result.sex).init();
        initDateSelect();
        // 出生年月日
        var birthday = result.birthday.split(dateDelimiter);
        $("#inputBirthYear").val(birthday[0]);
        $("#inputBirthMonth").val(birthday[1]);
        $("#inputBirthDay").val(birthday[2]);
        // 入职日期
        var entryDate = result.entryDate.split(dateDelimiter);
        $("#inputEntryYear").val(entryDate[0]);
        $("#inputEntryMonth").val(entryDate[1]);
        $("#inputEntryDay").val(entryDate[2]);
        // 手机号码
        $("#inputCellPhone").val(result.cellphone);
        // 权限
        var permissions = result.permissions;
        if(hasPermission(permissions, "1")) { // 管理权限
          $("#inputPermissionManage").attr("checked", true);
        }
        if(hasPermission(permissions, "2")) { // 收银权限
          $("#inputPermissionCash").attr("checked", true);
        }
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
  user.name = $("#inputName").val();
  // 性别
  user.sex = $("#inputSex").attr("value");
  // 出生年月日
  user.birthday = $("#inputBirthYear").val() + dateDelimiter
    + $("#inputBirthMonth").val() + dateDelimiter + $("#inputBirthDay").val();
  // 入职日期
  user.entryDate = $("#inputEntryYear").val() + dateDelimiter
    + $("#inputEntryMonth").val() + dateDelimiter + $("#inputEntryDay").val();
  // 手机号码
  user.cellphone = $("#inputCellPhone").val();
  // 权限
  user.permissions = [];

  $("input[name='inputPermission']:checked").each(function() {
    user.permissions.push($(this).val());
  });
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

  var userId = $("#userId").val();
  if(userId) { // 更新
    user.userId = userId;
    smart.dopost("/admin/user/update.json", user, function(err, result) {
      if (err) {
        smart.error(err, i18n["js.common.add.error"], false);
      } else {
        window.location = "/admin/users";
      }
    });
  } else { // 添加
    smart.doput("/admin/user/add.json", user, function(err, result) {
      if (err) {
        smart.error(err, i18n["js.common.add.error"], false);
      } else {
        window.location = "/admin/users";
      }
    });
  }
}

function removeUser() {

  if(window.confirm("确定要删除店员？")) {
    smart.dodelete("/admin/user/remove.json", {userId: $("#userId").val()}, function(err, result) {
      if (err) {
        smart.error(err, i18n["js.common.add.error"], false);
      } else {
        window.location = "/admin/users";
      }
    });
  }
}

function hasPermission(permissions, code) {
  for(var i = 0; i < permissions.length; i++) {
    if(permissions[i] === code) {
      return true;
    }
  }

  return false;
}
