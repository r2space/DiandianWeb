
$(function () {
  'use strict';

  var screenCounter = 0;
  var rowMax = 3, colMax = 3;
  var screenSort = [];

  $('#addmenuScreen').on("click", function(){

    smart.paginationInitalized = false;
    $('#selectMenuType').modal("show");
  });

  $('#selectedMenuType').click(
    function () {
      $('#selectMenuType').modal("hide");
    }
  );

  $('#selectedType').click(
    function () {
      $('#selectMenuType').modal("hide");
    }
  );

  $('#selectMenuType').on('click', function(){
    insertLandscapeScreenAfter(-1);
  });

  function insertLandscapeScreenAfter(screenNum){
//    screenNum = parseInt(screenNum);
//
//    var tiles = getTilesSetting(1).tile;
//
//    var newScreenMun = ++screenCounter;
//    var tileNumStart = (newScreenMun - 1) * colMax * rowMax +1;
//
//    var asFirst = screenNum == 0;
//    var asLast = screenNum == -1;
//    if(asFirst){//first
//      screenSort.unshift(newScreenMun)
//    } else if(asLast){//last
//      screenSort.push(newScreenMun);
//    } else {
//      var newSort = [];
//      _.each(screenSort, function(screen){
//        newSort.push(screen);
//        if(screen == screenNum){
//          newSort.push(newScreenMun);
//        }
//      });
//      screenSort = newSort;
//    }
//
//    if(newScreenMun>getLandscapeScreenCount()){
//      for(var i = 0; i < colMax * rowMax; i++){
//        var newTile = {};
//        newTile.num = tileNumStart + i;
//        newTile.rowspan = 1;
//        newTile.colspan = 1;
//        tiles.push(newTile);
//      }
//    }
//
//    console.log(screenSort);
//
    var tr = $('#layoutLandscape');

    var td = $('<td/>');
    td.attr('id','layoutLandscapePanel');
    td.addClass('');

    var table = $('<table/>');
    table.attr('id','layoutLandscape');
    table.attr('screen',1);
    table.attr("width", 540);
    table.attr("height", 408);
    td.append(table);
    tr.append(td);
//
//    var tools = _.template($('#tmpl_layout_toolbox').html(),{screen:newScreenMun});
//    li.append(tools);
//
////    li.append($('<div class="tools tools-right"><a href="#"><i class="icon-link"></i></a><a href="#"><i class="icon-paper-clip"></i></a><a href="#"><i class="icon-pencil"></i></a><a href="#"><i class="icon-remove red"></i></a></div>'));
//    if(asFirst || asLast){
//      ul.append(li);
//    } else{
//      var beforeDiv = $('#layoutLandscapePanel' + screenNum);
//      beforeDiv.after(li);
//    }
//
//    createBorder(newScreenMun);
    redrawLandscapeLayout();

  } ;

  function redrawLandscapeLayout() {
    var table = $('#layoutLandscape');
    table.html('');

    var html = '';

    //九张图片的布局
//    for (var row = 1; row <= rowMax; row++) {
//      var tr = $('<tr/>');
//      table.append(tr);
//      for (var col = 1; col <= colMax; col++) {
//        var tileNum = (row - 1) * colMax + col;
//     //   var tile = getLandscapeTileInScreen(screenNum, tileNum);
//   //     if (tile.colspan > 0 && tile.rowspan > 0) {
//          var td = $('<td/>');
//          td.addClass('');
//          td.attr("colspan", 3);
//          td.attr("rowspan", 1);
//          td.attr("width", 180);
//          td.attr("height", 136);
//          td.attr("tileNum", tileNum);
//          td.attr("screen", 1);
//          var img = $('<img/>');
//     //     if(tile.synthetic && tile.synthetic.cover && tile.synthetic.cover.length>0 && tile.synthetic.cover[0].material){
//     //       var src = '/picture/' + tile.synthetic.cover[0].material.fileid;
//     //       img.attr('src', src);
//     //     }
//
//          img.css({width: 180, height: 136});
//
//          td.append(img);
//          tr.append(td);
//
////          td.on('click', function (e) {
////            var selectedTd = $(this);
////            smart.paginationInitalized = false;
////            showSyntheticList(0,20,'imageWithThumb,normal,gallery,solutionmap,Introduction',function(syntheticId,synthetic){
////              var num = selectedTd.attr("tileNum");
////              var screen = selectedTd.attr("screen");
////              var t = getLandscapeTileInScreen(screen, num);
////
////              t.syntheticId = syntheticId;
////              t.synthetic =synthetic;
////              if(synthetic.cover && synthetic.cover.length>0 && synthetic.cover[0].material){
////                var src = '/picture/' + synthetic.cover[0].material.fileid;
////                selectedTd.find('img').attr('src', src);
////              }
////              console.log(t);
////            });
////          });
//
//   //       displayBorder(screenNum);
//    //    }
//      }
//    }

    //一张图片的布局
//    var tr = $('<tr/>');
//
//    table.append(tr);
//    var tileNum = 1;
//
//    var td = $('<td/>');
//    td.addClass('');
//    td.attr("colspan", 1);
//    td.attr("rowspan", 1);
//    td.attr("width", 550);
//    td.attr("height", 418);
//    td.attr("tileNum", tileNum);
//    td.attr("screen", 1);
//
//    var img = $('<img/>');
//    img.css({width: 550, height: 418});
//    td.append(img);
//    tr.append(td);

    //6张图片的布局
    var tr = $('<tr/>');

    table.append(tr);
    var tileNum = 1;

    var th = $('<th/>');
    var td = $('<td/>');
    th.addClass('');
    th.attr("colspan", 2);
    th.attr("rowspan", 2);
    th.attr("width", 365);
    th.attr("height", 277);
    th.attr("tileNum", 1);
    var img = $('<img/>');
    img.css({width: 365, height: 277});
    th.append(img);
    tr.append(th);
    th.on('click', function (e) {
      var selectedTd = $(this);
      smart.paginationInitalized = false;
      $('#selectItemList').modal("show");
    });

    td.attr("screen", 1);
    td.addClass('');
    td.attr("colspan", 1);
    td.attr("rowspan", 1);
    td.attr("width", 180);
    td.attr("height", 136);
    td.attr("tileNum", tileNum);
    td.attr("screen", 1);

    var img = $('<img/>');
    img.css({width: 180, height: 136});
    td.append(img);
    tr.append(td);
    td.on('click', function (e) {
      var selectedTd = $(this);
      smart.paginationInitalized = false;
      $('#selectItemList').modal("show");
    });

    var tr = $('<tr/>');
    table.append(tr);

    var td = $('<td/>');
    td.addClass('');
    td.attr("colspan", 3);
    td.attr("rowspan", 1);
    td.attr("width", 180);
    td.attr("height", 136);
    td.attr("tileNum", 1);
    td.attr("screen", 1);
    var img = $('<img/>');
    img.css({width: 180, height: 136});
    td.append(img);
    tr.append(td);
    td.on('click', function (e) {
      var selectedTd = $(this);
      smart.paginationInitalized = false;
      $('#selectItemList').modal("show");
    });

    var tr = $('<tr/>');
      table.append(tr);
      for (var col = 1; col <= colMax; col++) {

        var td = $('<td/>');
        td.addClass('');
        td.attr("colspan", 1);
        td.attr("rowspan", 1);
        td.attr("width", 180);
        td.attr("height", 136);
        td.attr("tileNum", 1);
        td.attr("screen", 1);
        var img = $('<img/>');


        img.css({width: 180, height: 136});

        td.append(img);
        tr.append(td);

        td.on('click', function (e) {
          var selectedTd = $(this);
          smart.paginationInitalized = false;
          $('#selectItemList').modal("show");
        });

      }
  }


});