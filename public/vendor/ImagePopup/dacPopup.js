var $tplUtil = {
  format: function (tpl, args) {
    for (var i = 0; i < args.length; i++) {
      tpl = tpl.replace(new RegExp("\\{" + i + "\\}", "g"), args[i]);
    }
    return tpl;
  },

  version: '0.1'
}

function ImagePopup(opt, callback) {
//初始化
  var _type = {single: "single", multiple: "multiple", video: "video"};
  this._tpltype = {image:'image'};

  this.template = {image: '', video: '',tags:'',tagsall:''};
  this._store = {ddd:'dd'};
  this._total = 0;
  this._tags = '';
  var options = opt || {};
  var el = options.el;
  var data = options.data;
  var tpl = options.tpl;
  var type = options.type;
  var that = this;
  var ajaxStatus = 0;
  var start = 0;
  var count = 15;
  var _index_num = 0 ;
  this._tags_store = [];
  var cur_tags = '';

  this.init = function(){
    that.template.image = $("#tmpl_popup_image").html();
    that.template.video = $("#tmpl_popup_video").html();

    that.template.tags = $("#tmpl_tag_item").html();
    that.template.tagsall = $("#tmpl_tag_item_all").html();
    var localLoad = i18n["js.public.info.detaillist.loading"];
    var localHtml = '<div id=\"hook\" class=\"hook\">'+ localLoad + '</div>';
    $("#input_filter").css("display","none");
    $("#" + el + " div[class=modal-body]").html("<ol id=\"taglist\"  class=\"popular-tags group material_tags\"></ol>");
    $("#" + el + " div[class=modal-body]").append("<div id=\"material_popup\" class=\"material_popup\"></div>");
    $("#" + el + " div[class=material_popup]").append(localHtml);
    $("#" + el).modal('show');
  };
  var _initTagsStore = function(data){
    var tmp = [];
    for(var i in data){
      console.log(data[i]);
      if(data[i].name){
        tmp.push({
          data: '',
          name:data[i].name,
          counter :data[i].counter
        });
      }
    }
    that._tags_store = tmp;
  };
  var _initStore = function(data){

    var tmp = [];
    that._total = data.totalItems;
    that._store = data.items;
    if(opt.tpl == that._tpltype.image){
      for(var i in that._store){
        if(true){
          var f = that._store[i].thumb ? that._store[i].thumb.middle : that._store[i].smallimage
          tmp.push({
            item_id:that._store[i]._id ,
            fileid:f,
            image:'/picture/' + f,
            filename :that._store[i].filename,
            num:_index_num++
          });

          that._tags_store.push();
        }
      }
    }

//数据移形
    that._store = tmp;
  };

  var _render = function (listener) {
    for (var i in that._store) {
      var _tpl = undefined;
      if(opt.type == "video"){
        _tpl = _.template(that.template.video,that._store[i]);
      }else{
        _tpl = _.template(that.template.image,that._store[i]);
      }

      $("#hook").before(_tpl);
    }
    listener();
  }
  var _redner_tags = function(listener){
    for(var i in that._tags_store){
      console.log(that._tags_store[i]);
      var _tpl = _.template(that.template.tags,that._tags_store[i]);
      $("#taglist").append(_tpl);
    }
    var _tpl = _.template(that.template.tagsall);
    $("#taglist").append(_tpl);
    listener();
  }
  var _listener_tags = function(){
    $("#taglist").unbind("click").on("click","a",function(e){
      cur_tags = $(e.target).html();
      var cur_data = $(e.target).attr("data");
      reloadStore(cur_data);
    })
  }
  var _listener = function(){
    var that = this;
    var max_scroll = 0;

//单选
    if(type == _type.single || type == _type.video){
      $("#" + el + " button[action=ok]").unbind("click").bind("click", function () {
        var _src = $($("#" + el + " div[checked]").parent().find(opt.type == "video"?"video": "img" +"[class=material_thumb]")).attr("src");
        var _fileid = $($("#" + el + " div[checked]").parent().find(opt.type == "video"?"video": "img" +"[class=material_thumb]")).attr("data");
        var item_id = $($("#" + el + " div[checked]").parent().find(opt.type == "video"?"video": "img" +"[class=material_thumb]")).attr("item_id");
        $("#" + el).modal('hide');
        var event = {
          image: _src,
          fileid : _fileid,
          item_id: item_id
        };
        callback(event);
      });
      $("#" + el).unbind('click').on("click", opt.type == "video"?"video": "img", function (e) {
        var $target = $($(e.target).parent().find('div'));
        $("#" + el + " div[checked]").removeClass("checked");
        $("#" + el + " div[checked]").removeAttr("checked");
        $target.toggleClass("checked");
        $target.attr("checked", true);
      });
    }
//多选
    if(type == _type.multiple){
      var event = [];
      $("#" + el + " button[action=ok]").unbind("click").bind("click", function () {
        var check_doms = $("#" + el + " div[checked]").parent().find(".material_thumb").toArray();
        console.log(check_doms);
        for(var i in check_doms){
          console.log(check_doms[i]);
          event.push({
            item_id : $(check_doms[i]).attr("item_id"),
            image : $(check_doms[i]).attr("src"),
            fileid :$(check_doms[i]).attr("data")
          });
        }
        $("#" + el).modal('hide');
        callback(event);
      });
      $("#" + el).unbind('click').on("click", opt.type == "video" ? "video" : "img", function (e) {
        var $target = $($(e.target).parent().find('div'));
        $target.toggleClass("checked");
        if (!$target.attr("checked")) {
          $target.attr("checked", true);
        } else {
          $target.removeAttr("checked");
        }
      });
    }
    $("#" + el).unbind('mouseover').on("mouseover",opt.type == "video"?"video": "img", function (e) {
      var $target = $(e.target);
      if ($target.attr('src') == '/images/img_check.png') {
        return;
      }
      $target.css("position", "absolute");
      $target.css("top", "-10px");
      var _num = parseInt($($target.parent().find('.modalfix_checkbox')).attr("num"));
      console.log(_num % 5);
      if (_num % 5 == 4) {
        $target.css("left", "-70px");
      } else if (_num % 5 == 3) {
        $target.css("left", "-30px");
      } else if (_num % 5 == 0) {
        $target.css("left", "0px");
      } else {
        $target.css("left", "-20px");
      }
      $target.css("width", "170%");
      $target.css("z-index", "2000");
      $target.css("height", "auto");
      $target.css("min-height", "120px");
      $target.css("border", "2px solid #e3e3e3");
    });
    $("#" + el).unbind("mouseout").on("mouseout", opt.type == "video"?"video": "img", function (e) {

      var $target = $(e.target);
      if ($target.attr('src') == '/images/img_check.png') {
        return;
      }
      $target.css("position", "absolute");
      $target.css("top", "2px");
      $target.css("left", "2px");
      $target.css("width", "100px");
      $target.css("z-index", "0");
      $target.css("height", "100px");
      $target.css("min-height", "100px");
      $target.css("border", "0px");
      $target.css("margin", "0px");
    });

    $('#hook').unbind("click").bind("click",function(){
      console.log("继续刷新");
      start = start + 15;
      loadStore();
    });
    $("#material_popup").scroll(function(e){
//      var material_popup = $(".material_popup")[0];
      var material_popup = e.target;
      var scrollHeight =  material_popup.scrollHeight;
      var scrollTop = material_popup.scrollTop;
//      console.log("scrollHeight : " + scrollHeight + "    scrollTop : " + scrollTop);
      if(scrollHeight == (scrollTop+330)){
        console.log("滚屏刷新");
        start = start + 15;
        if(ajaxStatus==0){
          ajaxStatus = 1;
          loadStore();
        }

      }
    });

//多选
//预览
//下拉刷新
//filter
  };
  var loadStore = function(){
//    var that = this;
    var tags = that._tags;
    ajaxStatus = 1 ;
    $("#hook").html(i18n["js.public.info.detaillist.loading"]);
//    http://localhost:3000/item/list.json?start=0&count=20
    var url = $tplUtil.format('/item/list.json?start={0}&count={1}&tags={2}',[start,count,cur_tags]);

    smart.doget(url, function (err, result) {
      console.log(url);
      if (smart.error(err, i18n["js.common.search.error"], false)) {
        return;
      }

      console.log(result);
      _initStore(result);
      var total = that._total;
      setTimeout(function(){
        ajaxStatus = 0;
        $("#hook").html(i18n["js.public.info.detaillist.loading"]);
        if(total < 15){
          $("#hook").hide();
        }else{
          $("#hook").show();
        }
        _render(_listener);
      },1000);

    });
  };
  var reloadStore = function(data){
    start = 0 ;
    _index_num = 0 ;
    that.init();
    if(data=="all"){
      cur_tags = '';
    }
    if(ajaxStatus == 0 ){
      loadStore();
    }
    filterStore();
  }
  var filterStore =  function(){
    var that = this;
    var url_tags = "/tag/search.json?count=100&start=0";
    smart.doget(url_tags,function(err,result){
      console.log(result);
      _initTagsStore(result);
      _redner_tags(_listener_tags);
    });
  }

  loadStore();
  filterStore();
//单选
//多选
//预览
//filter

//选中callback

//下拉刷新

//先做单选
};
ImagePopup.prototype.show = function(){
  this.init();
}
