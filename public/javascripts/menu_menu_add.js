
$(function () {
  'use strict';

  var screenCounter = 0;
  var rowMax = 3, colMax = 3;
  var screenSort = [];

  $('#addLargeMenuScreen').on("click", function(){
    insertLandscapeScreenAfter(1);
  });

  $('#addMediumMenuScreen').on("click", function(){
    insertLandscapeScreenAfter(2);
  });

  $('#addSmallMenuScreen').on("click", function(){
    insertLandscapeScreenAfter(3);
  });

  $( "p" ).click(function() {
    $( this ).slideUp();
  });

  function insertLandscapeScreenAfter(screenNum){

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
      scrollLeft: main.width()-549
    }, 400);
  }

});