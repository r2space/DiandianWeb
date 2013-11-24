$(function () {
  'use strict';

  render(0, 20);

  events();
});

/**
 * 绘制画面
 */
function render(skip, limit , keyword) {
  keyword = keyword ? encodeURIComponent(keyword) : "";

  smart.doget("/admin/user/list.json?limit=" + count + "&skip=" + skip + "&keyword=" + keyword, function (err, result) {

    if (err) {
      smart.error(err,i18n["js.common.search.error"],false);
    } else {
      var tmpl = $('#tmpl_user_list').html()
        , container = $("#user_list")
        , index = 1;

      container.html("");
      var list = result.items;
      _.each(result.items, function (row) {
        container.append(_.template(tmpl, {
            "index": index++ + skip
          , "_id": row._id
          , "id": row.id
          , "realName": row.realName
          , "cellphone": row.cellphone
          , "entryDate": row.entryDate
          , "sex": row.sex === "1" ? "男" : "女"
          , "birthday": row.birthday
        }));
      });

      if(list.length == 0) {
        container.html("<tr><td colspan=10>" + i18n["js.common.list.empty"] + "</td></tr>");
      }

      // 设定翻页
      smart.pagination($("#pagination_area"), result.totalItems, 20, function(active) {
        doSearch(active, 20);
      });
    }

  });
}

function events() {

  $("#doSearchUser").click(function() {
    doSearch(0, 20);
  });
}

function doSearch(skip, limit) {
  var keyword =  $("#user_search").val();
  smart.paginationInitalized = false;
  render(skip, limit, keyword);
}
