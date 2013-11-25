
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

  var username = $('#name').val()
    , password = $('#pass').val()
    , path = $('#path').val()
    , csrftoken = $('#_csrf').val();

  if (client.browser.ie >=10 || client.browser.chrome !=0 || client.browser.safari !=0) {

  } else {
    Alertify.log.info("supported Browsers: chrome,safari,IE10");
    return;
  }

  // 必须输入，否则摇一摇
  if (username.length <= 0 || password.length <= 0) {

    var container = $('#container-demo');
    
    container.trigger('startRumble');
    clearTimeout(demoTimeout);
    demoTimeout = setTimeout(function(){container.trigger('stopRumble');}, 200);
  } else {

    $.ajax({
        url: "/simplelogin"
      , async: false
      , type: "GET"
      , data: {
        "path": path, "name": username, "password": password, "home": "diandian"
      }
      , success: function(data, textStatus, jqXHR) {
        try {
          if (jqXHR.status != 200) {
            Alertify.log.info(data);
          }
          var error = (data && data.error) ? data.error: undefined;
          if (error) {
            if(error.code == 1020) {// 公司不存在
              Alertify.log.error(error.message);
              $('#path').focus();
            } else if(error.code) {
              Alertify.log.error(error.message);
            } else {
              Alertify.log.info(data);
            }
          } else {
            window.location = "/diandian";
          }
        } catch (e) {
          console.log(e);
        }
      }
      , error: function(jqXHR, textStatus, errorThrown) {
        Alertify.log.error(jqXHR.responseJSON.error.message);
      }
    });
  }
}

function applydata() {
    var btn = $('#btn-apply');
    var container = $('#container-apply');
    btn.hide();
    container.show();
}
