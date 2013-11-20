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

  keyword = keyword ? encodeURIComponent(keyword) : "";
  jsonUrl += "&keyword=" + keyword;

  smart.doget(jsonUrl, function(e, result){
    if (smart.error(e, i18n["js.common.search.error"], true)) {
      return;
    } else {
      itemList = result.items;
      var tmpl = $("#tmpl_item_list").html()
        , container = $("#item_list")
        , index = 1;

      container.html("");
      _.each(result.items, function(row){
        container.append(_.template(tmpl, {
          "id": row._id
          , "index": index++ + start
          , "itemName": row.itemName
          , "itemType": row.itemType
          , "itemPrice": row.itemPrice
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
    }
  });
}

function events() {

  $("#txt_search").bind("change",function(){
    var _keyword = '';
    _keyword =  $("#txt_search").val();
    smart.paginationInitalized = false;
    render(0, 20,_keyword);
  });

  $("#doSearch").bind("click",function(){
    var _keyword = '';
    _keyword =  $("#txt_search").val();
    smart.paginationInitalized = false;
    render(0, 20,_keyword);
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

        smart.dodelete("/desk/remove.json", {"id": rowId}, function(err, result){
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
  });
}
