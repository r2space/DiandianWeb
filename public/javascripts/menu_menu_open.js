$(function () {
  'use strict';
  $("#addMenu").bind("click", function(event){
    window.location = "add";
  })
  render();
  events();
});

function render(){
  var jsonUrl = "/menu/partialList.json?";
  jsonUrl += "field=" + "name+sortLevel";
  smart.doget(jsonUrl, function(e, result){

    if (smart.error(e, i18n["js.common.search.error"], true)) {
      return;
    }

    var list = result.items;
    if(!list || list.length == 0 ){
      container.html(i18n["js.common.list.empty"]);
    }

    _.each(_.sortBy(list,'sortLevel'), function(row){

      var brickItem = $('<div/>');
      brickItem.attr('id','brick-'+row._id);
      brickItem.addClass("brick");
      brickItem.html('<span>'+row.name+'</span>');
      $('.gridly').append(brickItem);
    });

    if($('.gridly').children.length > 0){
      initGridly();
    }
  });

}

function events () {

  $("#saveorder").on("click", function(event){
    var sort = [];
    $('.gridly').children().each(function (idx,item) {
      var brick = {};
      brick.id = $(item).attr('id').replace(/brick\-/, '');
      brick.level = parseInt($(item).css('left').replace(/px/,''));
      sort.push(brick);
    });

    if (sort.length == 0 ){
      Alertify.log.error(i18n["js.common.list.empty"]);
    }else{
      var data = {};
      _.each(_.sortBy(sort,'level'),function(it,idx){
        data[it.id] = idx + 1;
      });

      smart.dopost("/menu/updateSort.json", {order:data}, function(err, result) {
        if (err) {
          smart.error(err,i18n["js.common.update.error"],false);
        } else {
          window.location = "/menu/menu/open";
        }
      });
    }
  });


}

function initGridly () {
  $('.gridly').gridly({
    base: 60, // px 
    gutter: 10, // px
    columns: 12
  });
  $('.gridly').css('height','40px');
  $('.gridly div').css('min-width','60px');
  $('.gridly div').css('width','auto');
}

