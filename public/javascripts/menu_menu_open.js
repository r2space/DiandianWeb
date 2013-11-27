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
  jsonUrl += "filed=" + "name+sortLevel";
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
      menuItem.html('<span>'+row.name+'</span>');
      $('.menu-container').append(menuItem);

    });

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
          brickItem.attr('tmp',name);
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

}

function initGridly () {
  $('.gridly').gridly({
    base: 60, // px 
    gutter: 10, // px
    columns: 12
  });
  $('.gridly').css('height','40px');
}

function computeBrickPosition () {
  var left = $('.gridly').children().count * 70 ;
  return left+'px';
}