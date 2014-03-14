$(function () {
  'use strict';

  var itemId = $("#itemId").val();
  render(itemId);
  events(itemId);

  smart.view("tag").view.initialize("textBoxTag");

});

var pin = [];


function events(itemId) {
  $("#uploud_b").bind("click", function(){
    $("#uploadfile_b").trigger('click');
  });
  $("#uploadfile_b").bind("change", function(event){
    uploadFiles(event.target.files, "big");
  });

  $("#uploud_s").bind("click", function(){

    $("#uploadfile_s").trigger('click');
  });
  $("#uploadfile_s").bind("change", function(event){
    uploadFiles(event.target.files, "small");
  });

  $.each($(".menu-item"), function(idx, it) {
    it.onclick = function(event){
      var value   =  $(it).attr('value');
      if($(it).hasClass("selected")){
        pin = _.difference(pin,[value]);

        $(it).removeClass("selected");
      }else{
        $(it).addClass("selected");
        pin.push(value);
      }
    };
  });

  $("#saveitem").bind("click", function(event){

    var item = getItemData();
    console.log(item.printerId);

    if (!check_item(item)) {

      if (itemId) {

        item.id = itemId;

        smart.dopost("/item/update.json", item, function(err, result) {
          if (err) {
            smart.error(err,i18n["js.common.add.error"],false);
          } else {
            window.location = "/menu/item/list";
          }
        });
      } else {
        smart.dopost("/item/add.json", item, function(err, result) {
          if (err) {
            smart.error(err,i18n["js.common.add.error"],false);
          } else {
            window.location = "/menu/item/list";
          }
        });
      }
    }
  });

}

//取得菜品信息
function getItemData() {
  var tmpOption = $("#itemOption").val();
  var option = [];
  option = tmpOption.split(/[, ，]/);
  var item = {
      itemName : $("#itemName").val()
    , itemPriceNormal : $("#itemPriceNormal").val()
    , itemPriceHalf : $("#itemPriceHalf").val()
    , itemPriceDiscount : $("#itemPriceDiscount").val()
    , itemType : $("#itemType").val()
    , itemComment : $("#itemComment").val()
    , itemMaterial : $("#itemMaterial").val()
    , itemMethod : $("#itemMethod").val()
    , bigimage: $("#uploadfile_big").val()
    , smallimage : $("#uploadfile_big").val()
    , type: $("#inputType").attr("value")
    , printerId: $("#printerType").attr("value")
    , discount: $("#discount").attr("value")
    , option: option
  };
  var tag = []
    , inputTag = $("#itemType");

  // 输入框输入的文字，也直接变成Tag
  if (inputTag.val().length > 0) {
    tag.push(inputTag.val());
  }

  $("#textBoxTag li").each(function(index){
    if ($(this).attr("tagname").length > 0) {
      tag.push($(this).attr("tagname"));
    }
  });

  item.tags = tag;
  item.pin = pin;


  return item;
}


//更新用户
function updateItem(item) {
  smart.doput("/item/update.json", item, function(err, result){
    if (err) {
      smart.error(err,i18n["js.common.update.error"],false);
    } else {
      //更新成功返回列表
        window.location = "/menu/item/list";
    }
  });
}

function uploadFiles(files, uploudId) {
  if (!files || files.length <= 0) {
    return false;
  }

  var fd = new FormData();
  for (var i = 0; i < files.length; i++) {
    fd.append("files", files[i]);
  }



  // 发送文件
  smart.dopostData("/item/image/add.json", fd,function(err, result){
      if (uploudId == "small"){
        $("#uploadfile_small").val(result.data);
      } else{
        $("#uploadfile_big").val(result.data);
      }
      if(smart.error(err, i18n["js.common.upload.error"], false)){
        return;
      }

      $("#small_img").css("display", "block");
      $("#small_img").attr("src", "/picture/" + result.data);
    }

  );
}

function render(itemId) {

  if (itemId) {

    smart.doget("/item/findOne.json?itemId=" + itemId , function(err, result) {
      if (err) {
        smart.error(err,i18n["js.common.search.error"],false);
      } else {
        var option = "";
        if(result.option[0]){
          option = result.option[0];
          for (var i = 1; i <result.option.length; i++) {
            option =  option + "，" + result.option[i];
          }
        }
        $("#itemName").val(result.itemName);
        $("#itemPriceNormal").val(result.itemPriceNormal);
        $("#itemPriceHalf").val(result.itemPriceHalf);
        $("#itemPriceDiscount").val(result.itemPriceDiscount);
        $("#itemType").val(result.itemType);
        $("#itemComment").val(result.itemComment);
        $("#itemMaterial").val(result.itemMaterial);
        $("#itemMethod").val(result.itemMethod);
        $("#uploadfile_small").val(result.bigimage);
        $("#uploadfile_big").val(result.bigimage);
        $("#itemOption").val(option);
        new ButtonGroup("inputType", result.type).init();
        new ButtonGroup("printerType", result.printerId).init();
        new ButtonGroup("discount", result.discount).init();

        $("#small_img").css("display", "block");
        $("#small_img").attr("src", "/picture/" + result.bigimage);

        var tag = smart.view("tag").view;
        tag.setDefaults(result.tags);
        pin = result.pin;
        for (var i = 0; i < result.pin.length; i++) {
          $("#NO"+result.pin[i]).addClass("selected");
        }
        smart.doget("/printer/list.json",function(err, result1){
          if (err) {
            smart.error(err,i18n["js.common.search.error"],false);
          } else {
            var tmpl = $("#printer_type").html()
              , container = $("#printerType")
              , index = 1;

            container.html("");
            _.each(result1.items, function(row){
              if(row.type == "1"){

                container.append(_.template(tmpl, {
                  "id": row._id
                  , "index": row._id
                  , "printerName": row.name
                }));
              }
              new ButtonGroup("printerType",result.printerId).init();
            });
          }
        });
      }
    });
  }else {
    smart.doget("/printer/list.json",function(err, result){
      if (err) {
        smart.error(err,i18n["js.common.search.error"],false);
      } else {
        var tmpl = $("#printer_type").html()
          , container = $("#printerType")
          , index = 1;

        container.html("");
        _.each(result.items, function(row){
          if(row.type == "1"){

            container.append(_.template(tmpl, {
              "id": row._id
              , "index": row._id
              , "printerName": row.name
             }));
          }
          new ButtonGroup("printerType",row._id).init();
       });
      }
    });
    new ButtonGroup("inputType", "1").init();
    new ButtonGroup("discount", "0").init();
  }

}

function check_item(item) {
  var flag = 0;
  if (item.itemName == "") {
    Alertify.log.error(i18n["js.public.check.item.name"]);
    flag = 1;
  }
  if (item.bigimage == "") {
    Alertify.log.error(i18n["js.public.check.item.bigimage"]);
    flag = 1;
  }
  if (item.itemPriceNormal == "") {
    Alertify.log.error(i18n["js.public.check.item.price"]);
    flag = 1;
  }

  return flag;
}
