/**
 * User: Sara(fyx1014@hotmail.com)
 * Date: 13/11/22
 */

$(function () {
  'use strict';

  var pages = 0, cntGrid = 0;
  var gridWidth = 179, gridHeight = 135;
  var items = [];
  var newItems = [];

  var menu = {};
  menu.id = $("#menuId").val();
  var main = $("#layoutLandscapeMain");

  events(menu);
  render(menu.id);

  function events(menu) {

    // 大格页
    $('#addLargeMenuScreen').on("click", function(){
      insertLandscapeScreenAfterCur(1);
    });
    // 中格页
    $('#addMediumMenuScreen').on("click", function(){
      insertLandscapeScreenAfterCur(6);
    });
    // 小格页
    $('#addSmallMenuScreen').on("click", function(){
      insertLandscapeScreenAfterCur(9);
    });
    // pop x按钮
    $('#pickThumbPicClose').on("click", function(){
      $("#itemModal").modal("hide");
    });

    $('#deleteMenuScreen').on("click", function(){
      deleteLandscapeScreen();
    });

    $("#saveMenu").on("click", function(event){

      if(items.currentPageIdx){
        _.each(items,function(item){
          delete item.currentPageIdx;
        });
      }

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

    var mainScrollTimer;
    var space = $("#layoutLandscape");
    var scrollStart ;
    space.scroll(function() {
      if(!scrollStart){
        scrollStart = space.scrollLeft();
      }
      clearTimeout(mainScrollTimer);
      mainScrollTimer = setTimeout( mainScrollCheck , 100 );
    });
    var mainScrollCheck = function () { 
      var scrollNow = space.scrollLeft();
      var offset = scrollNow%549;
      if(offset ==0 ){
      }else{
        if(scrollStart > scrollNow){
          space.animate({
            scrollLeft: scrollNow - offset
          }, 200);
        }else{
          space.animate({
            scrollLeft: scrollNow + 549 - offset
          }, 200);
        }
      }
      scrollStart = undefined;
    };
  }

  function deleteLandscapeScreen () {
    var space = $("#layoutLandscape");
    console.log("#gridPageDiv_"+ parseInt(space.scrollLeft()/549));
    var currentPage = $("#gridPageDiv_"+ parseInt(space.scrollLeft()/549));
    var pagecounter = parseInt(space.scrollLeft()/549) + 1;
    currentPage.remove();
    main.width("-=549");
    pages--;

    var count = 0;
    newItems = [];
    _.each(items,function(item){
      if(item.currentPageIdx < pagecounter){
        item.index = ++count;
        newItems.push(item);
      } else if(item.currentPageIdx > pagecounter){
        item.index = ++count;
        item.currentPageIdx--;;
        newItems.push(item);
      }

    });

    items = [];
    items = newItems;

    var pageIdIdx = -1;
    var itemIdIdx = 1;
    var pageItemIdx = 1;
    $("div[id^='gridPageDiv']").each(function(){
        console.log($( this ).attr('id'));

        if(!$(this).attr('divtype')){
          pageIdIdx += 1;
          $(this).attr('id', 'gridPageDiv_' + pageIdIdx);
          pageItemIdx = 1;
        }else{
          $(this).attr('id','gridPageDiv_' +pageIdIdx+'_'+pageItemIdx );
          $(this).attr('index',itemIdIdx);
          pageItemIdx++;
          itemIdIdx++;
        }
    });


  }


  function insertLandscapeScreenAfter(screenNum, oldItems, index){
    var isEdit = (oldItems && oldItems[index-1]) ? 1 : 0;

    var pageDiv = $('<div/>');
    pageDiv.attr('id', 'gridPageDiv_' + pages);
    main.css( "width", "+=549" );

    // 加一页
    pages++;

    if (screenNum === 1) {
      var it = {index: ++cntGrid, row:3, column:3};

      it.currentPageIdx = pages;

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
      it.currentPageIdx = pages;

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
        it2.currentPageIdx = pages;
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

        it.currentPageIdx = pages;

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

  function insertLandscapeScreenAfterCur(screenNum){

    var space = $("#layoutLandscape");
    var currentPage = parseInt(space.scrollLeft()/549+2);
    var indexCounter = 0;
    if(pages > 0) {
      for (var i = 0; i < parseInt(space.scrollLeft()/549+1); i++) {
        if($("#gridPageDiv_"+ parseInt(i)).hasClass("landscapePageLarge")) {
          indexCounter += 1;
        }
        if($("#gridPageDiv_"+ parseInt(i)).hasClass("landscapePageMedium")) {
          indexCounter += 6;
        }
        if($("#gridPageDiv_"+ parseInt(i)).hasClass("landscapePageSmall")) {
          indexCounter += 9;
        }
      }
    }

    if (indexCounter == 0) {
      currentPage = 1;
    }
    var pageDiv = $('<div/>');
    pageDiv.attr('id', 'gridPageDiv_' + pages);
    main.css( "width", "+=549" );

    // 加一页
    pages++;

    var it = {};
    if (screenNum === 1) {
      it = {index: indexCounter+1, row:3, column:3};
      it.currentPageIdx = currentPage;
      pageDiv.addClass("landscapePageLarge");

      var gridDiv = $('<div/>');
      gridDiv.attr('id', 'gridPageDiv_' + pages + '_' + 1);
      gridDiv.attr('index', indexCounter+1);
      gridDiv.attr('divType', 3);
      gridDiv.addClass("itemDiv");

      pageDiv.append(gridDiv);

    } else if(screenNum === 6){
      var  tmpIndexCounterHtml = indexCounter+1;
      it = {index: indexCounter + 1, row:2, column:2};
      it.currentPageIdx = currentPage;

      pageDiv.addClass("landscapePageMedium");
      var gridDiv = $('<div/>');
      gridDiv.attr('id', 'gridPageDiv_' + pages + '_' + 1);
      gridDiv.attr('index', tmpIndexCounterHtml);
      gridDiv.attr('divType', 2);
      gridDiv.addClass("itemDiv");
      pageDiv.append(gridDiv);
      for (var i = 2; i < 7; i++){
        var grid = $('<div/>');
        grid.attr('id', 'gridPageDiv_' + pages + '_' + i);
        grid.attr('index', ++tmpIndexCounterHtml);
        grid.attr('divType', 1);
        grid.addClass("itemDiv");
        pageDiv.append(grid);
      }
    } else if (screenNum === 9){
      var tmpIndexCounterHtml = indexCounter+1;
      it = {index: indexCounter + 1, row:1, column:1};
      it.currentPageIdx = currentPage;
      pageDiv.addClass("landscapePageSmall");
      for (var i = 1; i < 10; i++){
        var grid = $('<div/>');
        grid.attr('id', 'gridPageDiv_' + pages + '_' + i);
        grid.attr('index', tmpIndexCounterHtml++);
        grid.attr('divType', 1);
        grid.addClass("itemDiv");
        pageDiv.append(grid);
      }
    }

    var tmp = [];
    var i = 0;
    var tmpIndexCounter = indexCounter + 1;
    for (i = 0; i < indexCounter; i++) {
      tmp[i] = items[i];
    }
    for (var j = 0; j < screenNum; j++) {
      if (j == 0) {
        tmp[i] = it;
      } else {
        var it2 = {index: ++tmpIndexCounter, row:1, column:1}
        it2.currentPageIdx = currentPage;
        tmp[i] = it2;
      }
      i++;
    }
    for (; i<items.length+screenNum; i++) {
      tmp[i]  = items[indexCounter];
      indexCounter++;
      tmp[i].index += screenNum;
      tmp[i].currentPageIdx += 1;
    }
    items = [];
    items = tmp;

    main.append(pageDiv);

    if (pages > 1) {
      pageDiv.insertBefore($("#gridPageDiv_"+ parseInt(space.scrollLeft()/549+1)));
      for (var i = pages-2; i >= parseInt(space.scrollLeft()/549+1); i--) {
        $("#gridPageDiv_" + i).attr("id","gridPageDiv_"+ (i+1));
        for (var j = 1; j<=9; j++) {
          if($("#gridPageDiv_"+ (i+1) + "_"+j).hasClass("itemDiv")){
            $("#gridPageDiv_"+ (i+1) + "_"+j ).attr("index",parseInt($("#gridPageDiv_"+ (i+1) + "_"+j).attr("index"))+1);
            $("#gridPageDiv_" + (i+1) + "_"+j).attr("id","gridPageDiv_"+ (i+2) + "_"+j);
          }
        }
      }
      $("#gridPageDiv_" + (pages - 1)).attr("id","gridPageDiv_"+ parseInt(space.scrollLeft()/549+1));
      for (var j=1; j<=9; j++) {
        if($("#gridPageDiv_" + (pages) + "_"+j)){
          $("#gridPageDiv_" + (pages) + "_"+j).attr("id","gridPageDiv_"+ parseInt(space.scrollLeft()/549+2) + "_"+j);
        }
      }
    }
    space.animate({
      scrollLeft:549*parseInt(space.scrollLeft()/549+1)
    }, 400);

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
