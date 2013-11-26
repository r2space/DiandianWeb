/**
 * Created with JetBrains WebStorm.
 * User: ZengXR
 * Date: 11/25/13
 * Time: 12:58 PM
 * To change this template use File | Settings | File Templates.
 */
/**
 * 搜索Tag
 */
 (function(Tag) {

  Tag.view = {

    model: undefined,
    active: undefined,            // 现在活动的输入框
    itemInputContainer: undefined,// 输入框外围的容器（DIV）
    itemContainer: undefined,     // 检索结果显示框
    tmplRow: undefined,
    tmplBox: undefined,
    tmplFinder: undefined,

    /**
     * 初始化
     */
    initialize: function(box, data) {

      this.model = Tag.model;

      this.tmplRow = $("#_tag_list_template");
      this.tmplBox = $("#_tag_box_template");
      this.tmplFinder = $("#tmpl_findresult");

      this.addFinder(box + "_finder");
      this.itemFinder = $("#" + box + "_finder");
      this.itemFinderContainer = $("#" + box + "_finder ul");
      this.itemInputContainer = $("#" + box);
      this.active = $("#" + box + " input");

      var self = this;
      this.setDefaults(data);

      /**
       * 绑定给定组件的键盘敲击事件
       */
      this.itemInputContainer.on("keydown", "input", function(event) {
        self.onPreSearch(event);
      });
      this.itemInputContainer.on("keyup", "input", function(event) {
        self.onSearch(event);
      });

      // 删除Tag按钮的事件绑定
      this.itemInputContainer.on("click", "li", function(){
        $(this).parent().remove(); return false;
      });

      // Tag一览中选择Tag的事件
      this.itemFinderContainer.on("click", "li", function(){
        var target = $(this).find("a")
          , tagname = target.attr("tagname");

        self.appendItem(tagname);
        self.itemFinder.hide();
        return false;
      });

      // 点击显示全结果
      this.active.bind("click", function(){
        self.model.fetch(null, function(err, result){
          self.render(result);
        });
      });

      // 点击输入框其他地方，则关闭
      $(document).bind("click", function(event){
        self.itemFinder.hide();
      });

    },

    /**
     * 显示Tag一览
     */
    render: function (data) {

      var self = this;
      this.itemFinderContainer.empty();
      this.itemFinder.hide();

      // 没有数据
      if (!data || data.length <= 0) {
        return false;
      }

      _.each(data, function(row){
        self.itemFinderContainer.append(_.template(self.tmplRow.html(), {"name": row.name}));
      });

      this.itemFinder.css("top", self.active.offset().top + 31);
      this.itemFinder.css("left", self.active.offset().left);
      this.itemFinder.show();
    },

    /**
     * 添加容器
     */
    addFinder: function(id) {
      $("body").append(_.template(this.tmplFinder.html(), {"id": id, "classname": "tagboxresult"}));
    },

    /**
     *
     */
    hide: function() {
      this.itemFinderContainer.empty();
      this.itemFinder.hide();
    },

    /**
     * 设定缺省值
     * @param defaults
     */
    setDefaults: function(defaults) {

      var self = this;
      this.itemInputContainer.find("ol").remove();
      _.each(defaults, function(item){
        self.appendItem(item);
      });
    },

    /**
     * 检索结果中选择一行
     */
    appendItem: function(name){
      var container = this.active.parent()
        , item = _.template(this.tmplBox.html(), {"name": name});

      item = item.replace(/\n/g, "").replace(/^[ ]*/, "");
      $(item).insertBefore(this.active);

      // 设定光标
      this.active.val("").focus();
    },

    /**
     * 检索（KeyDown）
     */
    onPreSearch: function(event) {

      var src = this.active = $(event.target);

      var inputValue = src.val()
        , c = event.keyCode;

      // 退格键在输入框没有值的时候，删除元素
      if (c == 8 && inputValue.length <= 0 && src.prev().is("ol")) {
        src.prev().remove();
      }
    },

    /**
     * 检索（KeyUp）
     */
    onSearch: function(event) {

      var self = this
        , src = this.active = $(event.target)
        , inputValue = src.val()
        , comma = inputValue.indexOf(",")
        , c = event.keyCode;

      // 关键字为空，则关闭检索框
      if (inputValue.length <= 0) {
        self.itemFinder.hide();
        return;
      }

      if (comma > 0) { // 输入有逗号，则当做一个Tag
        self.appendItem(inputValue.split(",")[0]);
        return;
      }

      if (c == 13) {// 回车当做一个Tag
        self.appendItem(inputValue.split(",")[0]);
        return;
      }

      // 检索数据，显示一览
      this.model.fetch(inputValue, function(err, result){
        self.render(result);
      });

    }
  },

    // Define a Finder
    Tag.model = {

      initialize: function(options) {
      },

      fetch: function(keyword, callback) {

        var param = keyword ? "&keywords=" + keyword : "";
        smart.doget("/tag/search.json?start=0&count=5" + param, function(err, result){
          callback(err, result);
        });
      },

      save: function() {
      }
    }

})(smart.view("tag"));


