$(function () {
  'use strict';

  // add layout
  $("#addFile").bind("click", function(event){
    window.location = "/menu/item/add";
  });
  render(0,20);

});

var itemList;

function render(start, count, keyword) {

  keyword = keyword ? encodeURIComponent(keyword) : "";
  smart.doget("/item/list.json?type=all&count=" + count + "&start=" + start +"&keyword=" + keyword, function(err, result){

    if (err) {
      smart.error(err,i18n["js.common.search.error"],false);
    } else {
      itemList = result.items;
      var tmpl = $('#tmpl_item_list').html()
        , container = $("#item_list")
        , index = 1;

      container.html("");
      _.each(result.items, function(row){
        container.append(_.template(tmpl, {
          "index": index++ + start
          , "itemName": row.itemName
          , "itemType": row.itemType
          , "itemPrice": row.itemPrice
          , "editat": smart.date(row.createat)
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
