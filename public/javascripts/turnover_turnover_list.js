$(function () {
  'use strict';
  render(0,20);
  events();

});

var itemList;

function render(start, count, keyword,startTime ,endTime) {

  var jsonUrl = "/turnover/list.json?";
  jsonUrl += "start=" + start;
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
    $("#serviceTotal").html("账单数量：" + result.total + "个");
    $("#serviceAmount").html("营业额：" +result.profit+ ".00元");
    container.html("");
    var statusRender = function(val){
      if(val == 1) {
        return "开台"
      } else {
        return "已结账"
      }
    }
    _.each(result.items, function(row){
      var imagetmp = "";
      imagetmp = "/picture/" + row.smallimage;
      container.append(_.template(tmpl, {
        "id": row._id ,
        "people": row.people ,
        "deskName" : row.desk ?row.desk.name :"外卖" ,
        "orderCount" : row.orderCount ,
        "amount" : row.amount ,
        "profit" : row.profit ,
        "status" : statusRender(row.status) ,
        "createat" : smart.date(row.createat) ,
        "editat" : smart.date(row.editat)
      }));

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
