/**
 * Created with JetBrains WebStorm.
 * User: Sara(fyx1014@hotmail.com)
 * Date: 19/11/12
 * Time: 15:10
 * To change this template use File | Settings | File Templates.
 */

$(function () {
  'use strict';

  $("#addDesk").bind("click", function(event){

    var desk = {
      name: $("#name").val()
      , capacity: $("#capacity").val()
      , type: $("#inputType").attr("value")
    };

    //if (!check_desk(desk)) {

      smart.dopost("/desk/add.json", desk, function(err, result) {
        if (err) {
          smart.error(err,i18n["js.common.add.error"],false);
        } else {
          window.location = "/shop/desk/list";
        }
      });

    //}
  });

  var deskId = $('#deskId').val();
  render(deskId);

});

function render(deskId) {

  if (deskId) {

    smart.doget("/desk/findOne.json?deskId=" + deskId , function(err, result) {
      if (err) {
        smart.error(err,i18n["js.common.search.error"],false);
      } else {
        new ButtonGroup("inputType", "0").init();
      }
    });
  } else {
    new ButtonGroup("inputType", "0").init();
  }
}

function check_desk(desk_) {
  var flag = 0;
  if (desk_.name == "") {
    Alertify.log.error(i18n["js.public.check.desk.name"]);
    flag = 1;
  } else if (desk_.capacity == "") {
    Alertify.log.error(i18n["js.public.check.desk.capacity"]);
    flag = 1;
  } else if (desk_.type == "") {
    Alertify.log.error(i18n["js.public.check.desk.type"]);
    flag = 1;
  }

  return flag;
}
