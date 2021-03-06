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

  var jsonUrl = "/turnover/itemUserRanking.json?start=1";
  var startTime = $("#startTime").val()
    , endTime = $("#endTime").val();
  if (startTime) {
    jsonUrl += "&startTime=" + startTime;
  }
  if (endTime) {
    jsonUrl += "&endTime=" + endTime;
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
    var list = _.sortBy(result.itemList, function(item) {
      return item.price * -1;
    });
    _.each(list, function (row) {
      container.append(_.template(tmpl, row));
    });
  });
}

function events() {
  $("#doSearch").bind("click", function () {
    render();
  });
}
