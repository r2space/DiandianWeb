/**
 * User: Sara(fyx1014@hotmail.com)
 * Date: 13/11/22
 */

$(function () {
  'use strict';

  var menuId = $("#menuId").val();
  events(menuId);
  render(menuId);

});

function events(menuId) {

  // 大格页
  $('#addLargeMenuScreen').on("click", function(){
    insertLandscapeScreenAfter(1);
  });
  // 中格页
  $('#addMediumMenuScreen').on("click", function(){
    insertLandscapeScreenAfter(2);
  });
  // 小格页
  $('#addSmallMenuScreen').on("click", function(){
    insertLandscapeScreenAfter(3);
  });

  $( "p" ).click(function() {
    $( this ).slideUp();
  });

  $("#saveMenu").on("click", function(event){

    var menu = {
      name: $("#menuName").val()
      , comment: $("#menuComment").val()
    };

    if (!check_menu(menu)) {

      if (menuId) {

        menu.id = menuId;
        smart.dopost("/menu/update.json", menu, function(err, result) {
          if (err) {
            smart.error(err,i18n["js.common.update.error"],false);
          } else {
            window.location = "/menu/menu/list";
          }
        });
      } else {
        smart.dopost("/menu/add.json", menu, function(err, result) {
          if (err) {
            smart.error(err,i18n["js.common.add.error"],false);
          } else {
            window.location = "/menu/menu/list";
          }
        });
      }
    }
  });
}

function insertLandscapeScreenAfter(screenNum){

  var main = $("#layoutLandscapeMain");
  main.css( "width", "+=549" );

  if (screenNum === 1) {
    main.append($("#largePageHidden").html());
  } else if(screenNum === 2){
    main.append($("#mediumPageHidden").html());
  } else if (screenNum === 3){
    main.append($("#smallPageHidden").html());
  }
  var space = $("#layoutLandscape");

  space.animate({
    scrollLeft: main.width()-549
  }, 400);
}

function render(menuId) {

  if (menuId) {

    smart.doget("/menu/findOne.json?id=" + menuId , function(err, result) {
      if (err) {
        smart.error(err,i18n["js.common.search.error"],false);
      } else {

        $("#menuName").val(result.name);
        $("#menuComment").val(result.comment);
      }
    });
  }
}

function check_menu(menu) {

  var flag = 0;
  if (menu.name == "") {
    Alertify.log.error(i18n["js.public.check.menu.name"]);
    flag = 1;
  }

  return flag;
}

