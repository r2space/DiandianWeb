$(function () {
  'use strict';

  new ButtonGroup("service-filter", "0", function (type) {
    var fn = function(remindTime){
      var  str=remindTime.toString();
      str =  str.replace(/-/g,"/");
      var d = new Date(str);
      return d;
    }
    var _keyword = '';
    _keyword =  $("#txt_search").val();
    var startTime = $("#startTime").val();
    var endTime = $("#endTime").val();
    console.log("startTime : " + startTime + "endTime : " + endTime);
    if(fn(startTime).getTime() - fn(endTime).getTime() > 0){
      Alertify.log.error("请选择开始时间小于结束时间");
      return;
    }
    smart.paginationInitalized = false;
    render(0, 20, _keyword,startTime,endTime);
  }).init();

  render(0,20);

  events();

});

var itemList;

function render(start, count, keyword,startTime ,endTime) {

  var jsonUrl = "/turnover/list.json?";
  jsonUrl += "type=" + $("#service-filter").attr("value");
  jsonUrl += "&start=" + start;
  jsonUrl += "&count=" + count;
  if(endTime)
    jsonUrl += "&endTime=" + endTime;
  if(startTime)
    jsonUrl += "&startTime=" + startTime;
  jsonUrl += "&_t=" + new Date().getTime();


  if(keyword){
    keyword = keyword ? encodeURIComponent(keyword) : "";
    jsonUrl += "&keyword=" + keyword;
  }

  smart.doget(jsonUrl, function(e, result){
    if (smart.error(e, i18n["js.common.search.error"], true)) {
      return;
    }
    itemList = result.items;
    var tmpl = $("#tmpl_turnover_list").html()
      , container = $("#turnover_list")
      , index = 1;
    $("#serviceTotal").html("账单数量:" + result.total + "个&nbsp;");
    $("#serviceAmount").html("营业额:" +result.profit+ "元&nbsp;");
    $("#serviceUserPay").html("实际收入:" +result.userPay+ "元&nbsp;");
    container.html("");
    var statusRender = function(val){
      if(val == 1) {
        return "就餐中"
      } else {
        return "已结账"
      }
    }
    _.each(result.items, function(row){
      var data;
      if(row.status == 1){
        data = {
          "id"        : row._id ,
          "billNum"   : "----",
          "people"    : row.people ,
          "deskName"  : row.desk ? row.desk.name :"外卖" ,
          "orderCount": row.orderCount ,
          "amount"    : "",
          "profit"    : "" ,
          "userPay"   : "",
          "agio"      : "",
          "status"    : statusRender(row.status) ,
          "createat"  : smart.date(row.createat) ,
          "editat"    : smart.date(row.editat)
        };
      }else{
        data = {
          "id"        : row._id ,
          "billNum"   : row.billNum,
          "people"    : row.people ,
          "deskName"  : row.desk ? row.desk.name :"外卖" ,
          "orderCount": row.orderCount ,
          "amount"    : row.amount + ".00" ,
          "profit"    : row.profit ,
          "userPay"   : row.userPay ? row.userPay : row.profit,
          "agio"      : row.agio == 1 ? "未打折" : parseInt(row.agio * 100) + "%",
          "status"    : statusRender(row.status) ,
          "createat"  : smart.date(row.createat) ,
          "editat"    : smart.date(row.editat)
        };
      }

      container.append(_.template(tmpl, data));

    });
    if(itemList.length == 0) {
      container.html(i18n["js.common.list.empty"]);
    }
    // 设定翻页
    smart.pagination($("#pagination_area"), result.total, count, function(active, rowCount){
      render.apply(window, [active, count,keyword ,startTime ,endTime]);
    });
  });
}

function events() {

  $("#turnover_list").on("click", "a", function(event){

    var target = $(event.target);
    var operation = target.attr("operation")
      , rowId = target.attr("rowId");

    if (operation == "detail") {
      var jsonUrl = "/turnover/findOne.json?";
      jsonUrl += "sid=" + rowId;

      smart.doget(jsonUrl, function(e, result){
        if (smart.error(e, i18n["js.common.search.error"], true)) {
          return;
        }
        var tmpl = $("#tmpl_oder_list").html()
          , container = $("#order_list");
        container.html("");
        _.each(result.orders, function(row){
          var state;
          if(row.back == 0){
            state = "未上";
          }else if(row.back == 1){
            state = "已上";
          }else if(row.back == 2){
            state = "退菜";
          }else if(row.back == 3){
            state = "免单";
          }
          container.append(_.template(tmpl, {
            "name"        : row.item.itemName
            ,"state"      : state
            ,"type"       : row.type==0 ? "大份":"小份"
            ,"amount"     : row.amount
            ,"amountPrice": row.amountPrice
          }));
        });

        $("#itemModal").modal("show");

      });
    }
  });

  $("#doSearch").bind("click",function(){
    var fn = function(remindTime){
      var  str=remindTime.toString();
      str =  str.replace(/-/g,"/");
      var d = new Date(str);
      return d;
    }
    var _keyword = '';
    _keyword =  $("#txt_search").val();
    var startTime = $("#startTime").val();
    var endTime = $("#endTime").val();
    console.log("startTime : " + startTime + "endTime : " + endTime);
    if(fn(startTime).getTime() - fn(endTime).getTime() > 0){
      Alertify.log.error("请选择开始时间小于结束时间");
      return;
    }
    smart.paginationInitalized = false;
    render(0, 20, _keyword,startTime,endTime);
  });

}
