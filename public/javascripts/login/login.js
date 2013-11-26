
$(function() {
  $('#container-demo').jrumble({
    x: 4,
    y: 0,
    rotation: 0
  });

  $("#loginform").keypress(function(e){
    if(e.keyCode == 13){
      login();
    }
  });
});

var demoTimeout;
function login() {

  var username = $("#name").val()
    , password = $("#pass").val();

  if (client.browser.ie >=10 || client.browser.chrome !=0 || client.browser.safari !=0) {
  } else {
    Alertify.log.info("supported Browsers: chrome, safari, IE10");
    return;
  }

  if (username.length <= 0 || password.length <= 0) {

    Alertify.log.info("请输入用户名，密码。");
  } else {

    smart.doget("/simplelogin?name=" + username + "&password=" + password, function(err, result) {
      if (err) {
        return Alertify.log.info("用户名或密码不正确");
      }

      window.location = "/diandian";
    });
  }
}

function applydata() {
    var btn = $('#btn-apply');
    var container = $('#container-apply');
    btn.hide();
    container.show();
}
