/**
 * Created by dacdev on 14-2-28.
 */
$(function () {
  'use strict';

  new ButtonGroup("sale-ranking-type", "-1", function (type) {
    renderData();
  }).init();

  events();
});

function render() {

  var jsonUrl = "/turnover/itemUserRanking.json";
  var startTime = $("#startTime").val();
  if (startTime) {
    jsonUrl += "?startTime=" + startTime;
  }

  $.blockUI({ message: '<h4>数据加载中...</h4>' });
  smart.doget(jsonUrl, function (e, result) {
    $.unblockUI();
    if (smart.error(e, i18n["js.common.search.error"], true)) {
      return;
    }

    var tmpl = $("#tmpl_item_list").html()
      , container = $("#sale-ranking-table");

    container.html("");
    _.each(result.itemList, function (row) {
      container.append(_.template(tmpl, row));
    });
  });
}

function events() {
  $("#doSearch").bind("click", function () {
    render();
  });
}
