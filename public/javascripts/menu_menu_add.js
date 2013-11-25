/**
 * User: Sara(fyx1014@hotmail.com)
 * Date: 13/11/22
 */

$(function () {
  'use strict';

  var pages = 0, cntGrid = 0;
  var gridWidth = 179, gridHeight = 135;
  var items = [];

  var menu = {};
  menu.id = $("#menuId").val();
  var main = $("#layoutLandscapeMain");

  events(menu);
  render(menu.id);

  function events(menu) {

    // 大格页
    $('#addLargeMenuScreen').on("click", function(){
      insertLandscapeScreenAfter(1, null, null);
    });
    // 中格页
    $('#addMediumMenuScreen').on("click", function(){
      insertLandscapeScreenAfter(2, null, null);
    });
    // 小格页
    $('#addSmallMenuScreen').on("click", function(){
      insertLandscapeScreenAfter(3, null, null);
    });
    // pop x按钮
    $('#pickThumbPicClose').on("click", function(){
      $("#itemModal").modal("hide");
    });

    $("#saveMenu").on("click", function(event){

      menu.name    = $("#menuName").val();
      menu.comment = $("#menuComment").val();
      menu.status  = $("#inputStatus").attr("value");
      menu.page    = pages;
      menu.items   = items;

      if (menu.name == "") {
        Alertify.log.error(i18n["js.public.check.menu.name"]);
      } else {

        if (menu.id) {
          smart.dopost("/menu/update.json", menu, function(err, result) {
            if (err) {
              smart.error(err,i18n["js.common.update.error"],false);
            } else {
              window.location = "/menu/menu/list";
            }
          });
        } else {
          smart.dopost("/menu/add.json", menu, function(err, result) {
            if (err) {
              smart.error(err,i18n["js.common.add.error"],false);
            } else {
              window.location = "/menu/menu/list";
            }
          });
        }
      }
    });

  }

  function insertLandscapeScreenAfter(screenNum, oldItems, index){
    var isEdit = (oldItems && oldItems[index-1]) ? 1 : 0;

    var pageDiv = $('<div/>');
    pageDiv.attr('id', 'gridPageDiv_' + pages);
    main.css( "width", "+=549" );

    if (screenNum === 1) {
      var it = {index: ++cntGrid, row:3, column:3};

      pageDiv.addClass("landscapePageLarge");
      var gridDiv = $('<div/>');
      gridDiv.attr('id', 'gridPageDiv_' + pages + '_' + 1);
      gridDiv.attr('index', cntGrid);
      gridDiv.attr('divType', 3);
      gridDiv.addClass("itemDiv");

      if (isEdit) {
        setImg(gridDiv, oldItems[index-1].image, 3);
        it.itemId = oldItems[index-1].itemId;
      }

      pageDiv.append(gridDiv);
      items.push(it);
      main.append(pageDiv);
    } else if(screenNum === 2){
      var it = {index: ++cntGrid, row:2, column:2};

      pageDiv.addClass("landscapePageMedium");
      var gridDiv = $('<div/>');
      gridDiv.attr('id', 'gridPageDiv_' + pages + '_' + 1);
      gridDiv.attr('index', cntGrid);
      gridDiv.attr('divType', 2);
      gridDiv.addClass("itemDiv");

      if (isEdit) {
        setImg(gridDiv, oldItems[index-1].image, 2);
        it.itemId = oldItems[index-1].itemId;
      }

      pageDiv.append(gridDiv);
      items.push(it);

      for (var i = 2; i < 7; i++){
        var it2 = {index: ++cntGrid, row:1, column:1};
        var grid = $('<div/>');
        grid.attr('id', 'gridPageDiv_' + pages + '_' + i);
        grid.attr('index', cntGrid);
        grid.attr('divType', 1);
        grid.addClass("itemDiv");
        if (isEdit) {
          setImg(grid, oldItems[index-1+i-1].image, 1);
          it2.itemId = oldItems[index-1+i-1].itemId;
        }
        pageDiv.append(grid);
        items.push(it2);
      }

      main.append(pageDiv);
    } else if (screenNum === 3){
      pageDiv.addClass("landscapePageSmall");

      for (var i = 1; i < 10; i++){
        var it = {index: ++cntGrid, row:1, column:1};

        var grid = $('<div/>');
        grid.attr('id', 'gridPageDiv_' + pages + '_' + i);
        grid.attr('index', cntGrid);
        grid.attr('divType', 1);
        grid.addClass("itemDiv");
        if (isEdit) {
          setImg(grid, oldItems[index-1+i-1].image, 1);
          it.itemId = oldItems[index-1+i-1].itemId;
        }
        pageDiv.append(grid);
        items.push(it);
      }

      main.append(pageDiv);
    }
    // 加一页
    pages++;
    // 菜品选择
    $.each($(".itemDiv"), function(idx, it) {

      it.onclick = function(event){
        var size =  $(it).attr('divType');
        var index=  $(it).attr('index');

        var selectedEvent = function(selectItem){
          setImg($(it),selectItem.fileid, size);
          items[index-1].itemId = selectItem.item_id;
        };
        var _popup = new ImagePopup({ type: 'single', tpl: 'image', el: 'itemModal' }, selectedEvent);
        _popup.show();

      };
    });

    var space = $("#layoutLandscape");

    space.animate({
      scrollLeft: main.width()-549
    }, 400);
  }

  function render(menuId) {

    if (menuId) {

      smart.doget("/menu/findOne.json?id=" + menuId , function(err, result) {
        if (err) {
          smart.error(err,i18n["js.common.search.error"],false);
        } else {

          $("#menuName").val(result.name);
          $("#menuComment").val(result.comment);
          new ButtonGroup("inputStatus", result.status).init();
          setItems(result.items, result.page);
        }
      });
    } else {
      new ButtonGroup("inputStatus", 0).init();
    }
  }

  function setItems(oldItems, page) {
    var index = 1;
    for(var i = 0; i < page; i++){
      var grid = oldItems[index-1];

      if (grid.row == 1) {
        insertLandscapeScreenAfter(3, oldItems, grid.index);
        index += 9;
      } else if (grid.row == 2) {
        insertLandscapeScreenAfter(2, oldItems, grid.index);
        index += 6;
      } else if (grid.row == 3){
        insertLandscapeScreenAfter(1, oldItems, grid.index);
        index+=1;
      }
    }
  }

  function setImg(target, fileId, size) {

    var img = $('<img/>');
    img.attr('src', '/picture/' + fileId);   console.log(fileId);
    img.css({width: gridWidth * size, height: gridHeight * size});

    target.html("");
    target.append(img);
  }

});
