
var core     = smart.core
  ,log        = smart.framework.log
  , desk  = require("../apis/desk")
  , menu  = require("../apis/menu")
  , item  = require("../apis/item")
//var apis    = require('./apis')
//  , website = require('./website');



/*
 * GET home page.
 */

exports.guiding = function (app) {
//  apis.guiding(app);
//  website.guiding(app);
  app.get("/",function(req, res) {
    res.render("login", {"title": "login"});
  });

  app.get("/login",function(req, res) {
    res.render("login", {"title": "login"});
  });

  app.get("/diandian",function(req, res) {
    res.render("diandian", {"title": "diandian", user: req.session.user});
  });

  // 登陆
  app.get('/simplelogin', function (req, res) {
    log.audit("login");
    core.user.login(req, res, function(){}, "diandian");
  });

  // 注销
  app.get("/simplelogout", function (req, res) {
    log.audit("logout");
    core.user.logout(req, res);
  });

  // 菜品
  app.get("/menu/item/list", function(req, res) {
    res.render("menu_item_list", {"title": "item", user: req.session.user});
  });

  //菜品增加
  app.get("/menu/item/add", function(req, res) {
    res.render("menu_item_add", {"title": "新增菜品", user: req.session.user, itemId: 0});
  });


  app.get('/menu/item/edit/:id', function (req, res) {
    res.render("menu_item_add", {"title": "item", user: req.session.user, itemId:req.params.id});
  });

  // 桌台
  app.get("/shop/desk/list", function(req, res) {
    res.render("shop_desk_list", {"title": "desk", user: req.session.user});
  });

  // 增加桌台
  app.get('/shop/desk/add', function(req, res){
    res.render("shop_desk_add", {"title": "desk", user: req.session.user, deskId: 0});
  });

  app.get('/shop/desk/edit/:id', function (req, res) {
    res.render("shop_desk_add", {"title": "desk", user: req.session.user, deskId:req.params.id});
  });

  // APIs
  app.get('/menu/list.json', function(req, res){
    menu.list(req, res);
  });


  app.get('/desk/list.json', function(req, res){
    desk.list(req, res);
  });

  app.post('/desk/add.json', function(req, res){
    desk.add(req, res);
  });

  app.post('/desk/update.json', function(req, res){
    desk.update(req, res);
  });

  app.post('/item/update.json', function(req, res){
    item.update(req, res);
  });

  app.delete('/desk/remove.json', function (req, res) {
    desk.remove(req,res);
  });

  app.get('/desk/findOne.json', function (req, res) {
    desk.findOne(req,res);
  });

  app.get('/item/findOne.json', function (req, res) {
    item.findOne(req,res);
  });

  //菜单
  app.get("/menu/menu/list", function(req, res) {
    res.render("menu_menu_list", {"title": "menu", user: req.session.user});
  });

  //菜品增加
  app.get("/menu/item/add", function(req, res) {
    res.render("menu_item_add", {"title": "新增菜品", user: req.session.user});
  });

  //菜单增加
  app.get("/menu/menu/add", function(req, res) {
    res.render("menu_menu_add", {"title": "新增菜单", user: req.session.user});
  });

};
