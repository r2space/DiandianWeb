$(function () {
  'use strict';

  //画面表示
  render();

  //事件追加
  events();

});

//画面表示
function render() {

}

function events() {
  $("#save").click(save);
}

//保存用户
function save() {

  var oldPassword = $("#inputOldPassword").val();
  var newPassword = $("#inputNewPassword").val();
  var repeatNewPassword = $("#inputRepeatNewPassword").val();

  if(oldPassword === '') {
    Alertify.log.error(i18n["js.public.check.user.oldPasswordIsEmpty"]);
    $("#inputOldPassword").focus();
    return;
  }

  if(newPassword === '') {
    Alertify.log.error(i18n["js.public.check.user.newPasswordIsEmpty"]);
    $("#inputNewPassword").focus();
    return;
  }

  if(newPassword !== repeatNewPassword) {
    Alertify.log.error(i18n["js.public.check.user.passwordNotSame"]);
    return;
  }

  var params = {
      uid         : $("#userId").val()
    , id          : $("#id").val()
    , oldPassword : oldPassword
    , newPassword : newPassword
  };

  smart.dopost("/admin/user/updatePassword.json", params, function(err, result) {
    if (err) {
      smart.error(err, i18n["js.common.update.error"], false);
    } else {
      $("#sub-container").hide();
      $("#save").hide();
      $("#message").show();
    }
  });
}
