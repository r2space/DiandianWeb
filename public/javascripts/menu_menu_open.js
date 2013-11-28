$(function () {
  'use strict';

  // add menu
  $("#addMenu").bind("click", function(event){
    window.location = "add";
  })
  // show list
  render();
  // get the events for buttons
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
    console.log(list);
    _.each(_.sortBy(list,'sortLevel'), function(row){

      var menuItem = $('<div/>');
      menuItem.attr('menu-id',row._id);
      menuItem.attr('menu-name',row.name);
      menuItem.addClass("menu-item pull-left");
      if(row.sortLevel != 10){
        menuItem.addClass("selected");
        var brickItem = $('<div/>');
        brickItem.attr('id','brick-'+row._id);
        brickItem.addClass("brick");
        brickItem.html('<span>'+row.name+'</span>');
        $('.gridly').append(brickItem);
      }
      menuItem.html('<span>'+row.name+'</span>');
      $('.menu-container').append(menuItem);
    });

    if($('.gridly').children.length > 0){
      initGridly();
    }

    $.each($(".menu-item"), function(idx, it) {
      it.onclick = function(event){
        var id   =  $(it).attr('menu-id');
        var name =  $(it).attr('menu-name');
        if($(it).hasClass("selected")){

          $(it).removeClass("selected");
          $('#brick-'+id).remove();

        }else{

          $(it).addClass("selected");
          var brickItem = $('<div/>');
          brickItem.attr('id','brick-'+id);
          brickItem.addClass("brick");
          brickItem.html('<span>'+name+'</span>');
          $('.gridly').append(brickItem);

        }
        initGridly();
      };
    });

    if(!list || list.length == 0 ){
      container.html(i18n["js.common.list.empty"]);
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
      Alertify.log.error(i18n["js.public.check.menu.name"]);
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
}

