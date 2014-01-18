$(function () {
  'use strict';

  // add layout
  $("#addFile").bind("click", function(event){
    window.location = "/menu/item/add";
  });
  render(0,20);
  events();

});

var itemList;

function render(start, count, keyword) {

  var jsonUrl = "/item/list.json?";
  jsonUrl += "start=" + start;
  jsonUrl += "&count=" + count;

  if(keyword){
    keyword = keyword ? encodeURIComponent(keyword) : "";
    jsonUrl += "&keyword=" + keyword;
  }

  smart.doget(jsonUrl, function(e, result){
    if (smart.error(e, i18n["js.common.search.error"], true)) {
      return;
    }
    itemList = result.items;
    var tmpl = $("#tmpl_item_list").html()
      , container = $("#item_list")
      , index = 1;

    container.html("");
    _.each(result.items, function(row){
      var imagetmp = "";
      imagetmp = "/picture/" + row.smallimage;
      container.append(_.template(tmpl, {
        "id": row._id
        , "index": index++ + start
        , "cover": imagetmp
        , "discount": row.discount === 0 ? i18n["html.label.item.info.no"] : i18n["html.label.item.info.yes"]
        , "itemName": row.itemName
        , "itemType": row.itemType
        , "type" : row.type == 0 ? i18n["html.label.item.food"] : (row.type == 1 ? i18n["html.label.item.dish"]:(row.type == 2 ? i18n["html.label.item.drinks"]:(row.type == 3 ? i18n["html.label.item.seafood"]:i18n["html.label.item.ad"])))
        , "itemPrice": row.itemPriceNormal
        , "editat": smart.date(row.editat)
      }));

    });
    if(itemList.length == 0) {
      container.html(i18n["js.common.list.empty"]);
    }
    // 设定翻页
    smart.pagination($("#pagination_area"), result.totalItems, count, function(active, rowCount){
      render.apply(window, [active, count,keyword]);
    });
  });
}

function events() {

  $("#txt_search").bind("change",function(){
    var _keyword = '';
    _keyword =  $("#txt_search").val();
    smart.paginationInitalized = false;
    render(0, 20, _keyword);
  });

  $("#doSearch").bind("click",function(){
    var _keyword = '';
    _keyword =  $("#txt_search").val();
    smart.paginationInitalized = false;
    render(0, 20, _keyword);
  });

  // list events
  $("#item_list").on("click", "a", function(event){

    var target = $(event.target);
    var operation = target.attr("operation")
      , rowId = target.attr("rowId");

    if (operation == "edit") {
      window.location = "/menu/item/edit/" + rowId;
    }

    if (operation == "delete") {
      Alertify.dialog.labels.ok = i18n["js.common.dialog.ok"];
      Alertify.dialog.labels.cancel = i18n["js.common.dialog.cancel"];
      Alertify.dialog.confirm(i18n["js.common.delete.confirm"], function () {

        smart.dodelete("/item/remove.json", {"id": rowId}, function(err, result){
          if (smart.error(err,i18n["js.common.delete.error"], false)) {

          } else {
            render(0, 20);
            Alertify.log.success(i18n["js.common.delete.success"]);
          }
        });
      }, function () {
        // Cancel
      });
    }

    if (operation == "preview") {

      var jsonUrl = "/item/list.json?";
      jsonUrl += "start=" + 0;
      jsonUrl += "&count=" + 20;

      smart.doget(jsonUrl, function(e, result){
        if (smart.error(e, i18n["js.common.search.error"], true)) {
          return;
        }
        itemList = result.items;
        var tmpl = $("#tmpl_pre_img").html()
          , container = $("#preImg")
          , index = 1;

        container.html("");
        _.each(result.items, function(row){
          var imagetmp = "";
          if(rowId == row._id) {
            imagetmp = "/picture/" + row.smallimage;
            container.append(_.template(tmpl, {
              "id": row._id
              ,"cover": imagetmp
            }));
          }

        });
      });
      $("#itemModal").modal("show");
    }
  });
}
