
$(function () {
  'use strict';

  var screenCounter = 0;
  var rowMax = 3, colMax = 3;
  var screenSort = [];

  // $('#addmenuScreen').on("click", function(){

  //   smart.paginationInitalized = false;
  //   $('#selectMenuType').modal("show");
  // });

  $('#addLargeMenuScreen').on("click", function(){
    insertLandscapeScreenAfter(1);
  });

  $('#addMediumMenuScreen').on("click", function(){
    insertLandscapeScreenAfter(2);
  });

  $('#addSmallMenuScreen').on("click", function(){
    insertLandscapeScreenAfter(3);
  });

  // $('#selectedMenuType').click(
  //   function () {
  //     $('#selectMenuType').modal("hide");
  //   }
  // );

  // $('#selectedType').click(
  //   function () {
  //     $('#selectMenuType').modal("hide");
  //   }
  // );

  // $('#selectMenuType').on('click', function(){
  //   insertLandscapeScreenAfter(2);
  // });

  $( "p" ).click(function() {
    $( this ).slideUp();
  });

  // function insertLandscapeScreenAfter(screenNum){
  //   var tr = $('#layoutLandscape');

  //   var td = $('<td/>');
  //   td.attr('id','layoutLandscapePanel');
  //   td.addClass('');

  //   var table = $('<table/>');
  //   table.attr('id','layoutLandscape');
  //   table.attr('screen',1);
  //   table.attr("width", 540);
  //   table.attr("height", 408);
  //   td.append(table);
  //   tr.append(td);

  //   redrawLandscapeLayout();
  // } ;

  // function redrawLandscapeLayout() {
  //   var table = $('#layoutLandscape');
  //   table.html('');

  //   var html = '';


  //   //6张图片的布局
  //   var tr = $('<tr/>');

  //   table.append(tr);
  //   var tileNum = 1;

  //   var th = $('<th/>');
  //   var td = $('<td/>');
  //   th.addClass('');
  //   th.attr("colspan", 2);
  //   th.attr("rowspan", 2);
  //   th.attr("width", 365);
  //   th.attr("height", 277);
  //   th.attr("tileNum", 1);
  //   var img = $('<img/>');
  //   img.css({width: 365, height: 277});
  //   th.append(img);
  //   tr.append(th);
  //   th.on('click', function (e) {
  //     var selectedTd = $(this);
  //     smart.paginationInitalized = false;
  //     $('#selectItemList').modal("show");
  //   });

  //   td.attr("screen", 1);
  //   td.addClass('');
  //   td.attr("colspan", 1);
  //   td.attr("rowspan", 1);
  //   td.attr("width", 180);
  //   td.attr("height", 136);
  //   td.attr("tileNum", tileNum);
  //   td.attr("screen", 1);

  //   var img = $('<img/>');
  //   img.css({width: 180, height: 136});
  //   td.append(img);
  //   tr.append(td);
  //   td.on('click', function (e) {
  //     var selectedTd = $(this);
  //     smart.paginationInitalized = false;
  //     $('#selectItemList').modal("show");
  //   });

  //   var tr = $('<tr/>');
  //   table.append(tr);

  //   var td = $('<td/>');
  //   td.addClass('');
  //   td.attr("colspan", 3);
  //   td.attr("rowspan", 1);
  //   td.attr("width", 180);
  //   td.attr("height", 136);
  //   td.attr("tileNum", 1);
  //   td.attr("screen", 1);
  //   var img = $('<img/>');
  //   img.css({width: 180, height: 136});
  //   td.append(img);
  //   tr.append(td);
  //   td.on('click', function (e) {
  //     var selectedTd = $(this);
  //     smart.paginationInitalized = false;
  //     $('#selectItemList').modal("show");
  //   });

  //   var tr = $('<tr/>');
  //     table.append(tr);
  //     for (var col = 1; col <= colMax; col++) {

  //       var td = $('<td/>');
  //       td.addClass('');
  //       td.attr("colspan", 1);
  //       td.attr("rowspan", 1);
  //       td.attr("width", 180);
  //       td.attr("height", 136);
  //       td.attr("tileNum", 1);
  //       td.attr("screen", 1);
  //       var img = $('<img/>');


  //       img.css({width: 180, height: 136});

  //       td.append(img);
  //       tr.append(td);

  //       td.on('click', function (e) {
  //         var selectedTd = $(this);
  //         smart.paginationInitalized = false;
  //         $('#selectItemList').modal("show");
  //       });

  //     }
  // }

  function insertLandscapeScreenAfter(screenNum){
    console.log(111);
    var main = $("#layoutLandscapeMain");
    main.css( "width", "+=549" );
    if (screenNum === 1) {
      main.append($("#largePageHidden").html());
    } else if(screenNum === 2){
      main.append($("#mediumPageHidden").html());
    } else if (screenNum === 3){
      main.append($("#smallPageHidden").html());
    }
    var space = $("#layoutLandscape");
    // space.scrollLeft(main.width()-549);
    space.animate({
      scrollLeft: main.width()-549,
    }, 400);
  }

});