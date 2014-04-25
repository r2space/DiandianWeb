/**
 * Created by dacdev on 14-2-28.
 */
$(function () {
  'use strict';

  new ButtonGroup("sale-ranking-type", "1", function (type) {
    renderData();
  }).init();
  new ButtonGroup("back-ranking-type", "1", function (type) {
    renderData();
  }).init();

  events();

});

function render() {


  renderData();
}

function renderData() {
  var startTime = $("#startTime").val();
  var endTime = $("#endTime").val();
  var saleType = $("#sale-ranking-type").attr("value");
  var backType = $("#back-ranking-type").attr("value");
  var jsonUrl = "/turnover/analytics.json?saleType=" + saleType + "&backType=" + backType;
  if (endTime)
    jsonUrl += "&endTime=" + endTime;
  if (startTime)
    jsonUrl += "&startTime=" + startTime;
  $.blockUI({ message: '<h4>数据加载中...</h4>' });
  smart.doget(jsonUrl, function (e, result) {
    $.unblockUI();
    if (smart.error(e, i18n["js.common.search.error"], true)) {
      return;
    }
    var tmpl = $("#tmpl_item_list").html()
      , container = $("#sale-ranking-table");
    container.html("");
    _.each(result.saleRanking, function (row) {
      container.append(_.template(tmpl, {
        "name": row.itemName,
        "count": row.saleCount,
        "price": (row.itemPriceNormal * row.saleCount).toFixed(1) || 0
      }));
    });

    container = $("#back-ranking-table");
    container.html("");
    _.each(result.backRanking, function (row) {
      container.append(_.template(tmpl, {
        "name": row.itemName,
        "count": row.backCount ,
        "price": (row.itemPriceNormal * row.backCount).toFixed(1) || 0
      }));
    });

  });
}

function events() {
  $("#doSearch").bind("click", function () {
    var fn = function (remindTime) {
      var str = remindTime.toString();
      str = str.replace(/-/g, "/");
      var d = new Date(str);
      return d;
    }
    var startTime = $("#startTime").val();
    var endTime = $("#endTime").val();
    if (fn(startTime).getTime() - fn(endTime).getTime() > 0) {
      Alertify.log.error("请选择开始时间小于结束时间");
      return;
    }
    render();
  });
}