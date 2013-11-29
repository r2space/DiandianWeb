/**
 * Created with JetBrains WebStorm.
 * User: ZengXR
 * Date: 11/25/13
 * Time: 9:56 AM
 * To change this template use File | Settings | File Templates.
 */

$(function () {
  'use strict';
  render(0,15);
  events();
});

// 保持一览数据
var deviceList;
/**
 * 绘制画面
 */
function render(start, count) {

  smart.doget("/device/list.json?count=" + count + "&start=" + start, function(e, result){

    deviceList = result.items;

    var temp_deviceAndUser = $('#temp_deviceAndUser_list').html()
      , temp_device = $('#tmpl_device_list').html()
      , temp_User = $('#tmpl_userinfo_list').html()
      , container_devAndUser = $("#deviceAndUser_list")
      , index_dev = 1;

    container_devAndUser.html("");
    _.each(result.items, function(row){

      //2.
      var devHtml = _.template(temp_device,{
        "dev_index": index_dev++ + start
        , "dev_Type": row.deviceType
        , "dev_id": row.deviceid
        , "devstatus" : row.devstatus
      });

      //1.
      var index_user = 1;
      var userHtml = "";
      _.each(row.userinfo,function(user) {
        userHtml+= _.template(temp_User,{
          "user_index": index_user++
          , "dev_id": row.deviceid
          , "user_id": user.userid
          , "user_status": user.status
        });
      });

      //3.
      container_devAndUser.append(_.template(temp_deviceAndUser,{
        "devinfo" :  devHtml
        , "userinfo" :  userHtml
      }));

    });

    // 设定翻页
    smart.pagination($("#pagination_area"), result.totalItems, count, function(active, rowCount){
      render.apply(window, [active, count]);
    });
  });
}

function events() {
  $("#deviceAndUser_list").on("click", "a[name=device]", function(event){
    var operation = $(event.target).attr("operation")
      , dev_id = $(event.target).attr("dev_id");
    if (operation == "deny") {
      smart.doput("/device/denyDeivce.json", {device: dev_id}, function(err, result){
        if (err) {
          Alertify.log.error(i18n["js.public.error.device.operation"]); console.log(err);
        } else {
          Alertify.log.info(i18n["js.public.info.device.deny"]);
          render(0, 15);
        }
      });
    }
    if (operation == "allow") {
      smart.doput("/device/allowDevice.json", {device: dev_id}, function(err, result){
        if (err) {
          Alertify.log.error(i18n["js.public.error.device.operation"]); console.log(err);
        } else {
          Alertify.log.info(i18n["js.public.info.device.allow"]);
          render(0, 15);
        }
      });
    }

  });

  // 一览按钮事件
  $("#deviceAndUser_list").on("click", "a[name=user]", function(event){
    var operation = $(event.target).attr("operation")
      , user_id = $(event.target).attr("user_id")
      , dev_id = $(event.target).attr("dev_id");

    // 禁止
    if (operation == "deny") {
      smart.doput("/device/deny.json", {user: user_id, device: dev_id}, function(err, result){
        if (err) {
          Alertify.log.error(i18n["js.public.error.device.operation"]); console.log(err);
        } else {
          Alertify.log.info(i18n["js.public.info.device.deny"]);
          render(0, 15);
        }
      });
    }

    // 允许
    if (operation == "allow") {
      smart.doput("/device/allow.json", {user: user_id, device: dev_id}, function(err, result){
        if (err) {
          Alertify.log.error(i18n["js.public.error.device.operation"]); console.log(err);
        } else {
          Alertify.log.info(i18n["js.public.info.device.allow"]);
          render(0, 15);
        }
      });
    }

    return false;
  });

}

