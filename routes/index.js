
var auth        = smart.framework.auth
  , context     = smart.framework.context
  , errors      = smart.framework.errors
  , log         = smart.framework.log
  , response    = smart.framework.response
  , desk        = require("../apis/desk")
  , menu        = require("../apis/menu")
  , item        = require("../apis/item")
  , user        = require("../apis/user")
  , ac          = require("../controllers/ctrl_ac");
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
    user.simpleLogin(req, res);
  });

  // 注销
  app.get("/simplelogout", function (req, res) {
    log.audit("logout");
    // TODO
    res.render("login", {"title": "login"});
  });

  /*-------------- 菜品 ---------------*/
  app.get("/menu/item/list", function(req, res) {
    res.render("menu_item_list", {"title": "item", user: req.session.user});
  });

  app.get("/menu/item/add", function(req, res) {
    res.render("menu_item_add", {"title": "item", user: req.session.user, itemId: ""});
  });

//  app.get('/picture/:id', function(req, res){
//    file.image(req, res, function(err, doc){
//      req.setAttribute("code","diandian");
//      res.send(doc);
//    });
//  });

  app.get('/menu/item/edit/:id', function (req, res) {
    res.render("menu_item_add", {"title": "item", user: req.session.user, itemId:req.params.id});
  });

  app.get('/item/list.json', function(req, res){
    item.list(req, res);
  });

  app.post('/item/add.json', function(req, res){
    item.add(req, res);
  });

  app.post('/item/update.json', function(req, res){
    item.update(req, res);
  });

  app.post("/item/image/add.json", function(req, res){
    item.updateimage(req, res);
  });

  app.delete('/item/remove.json', function (req, res) {
    item.remove(req,res);
  });

  app.get('/item/findOne.json', function (req, res) {
    item.findOne(req,res);
  });

  /*-------------- 菜单 ---------------*/
  app.get("/menu/menu/list", function(req, res) {
    res.render("menu_menu_list", {"title": "menu", user: req.session.user});
  });

  app.get("/menu/menu/add", function(req, res) {
    res.render("menu_menu_add", {"title": "menu", user: req.session.user, menuId: ""});
  });

  app.get('/menu/menu/edit/:id', function (req, res) {
    res.render("menu_menu_add", {"title": "menu", user: req.session.user, menuId:req.params.id});
  });

  app.get('/menu/list.json', function(req, res){
    menu.list(req, res);
  });

  app.post('/menu/add.json', function(req, res){
    menu.add(req, res);
  });

  app.post('/menu/update.json', function(req, res){
    menu.update(req, res);
  });

  app.delete('/menu/remove.json', function (req, res) {
    menu.remove(req,res);
  });

  app.get('/menu/findOne.json', function (req, res) {
    menu.findOne(req,res);
  });

  /*-------------- 桌台 ---------------*/
  app.get("/shop/desk/list", function(req, res) {
    res.render("shop_desk_list", {"title": "desk", user: req.session.user});
  });

  app.get('/shop/desk/add', function(req, res){
    res.render("shop_desk_add", {"title": "desk", user: req.session.user, deskId: ""});
  });

  app.get('/shop/desk/edit/:id', function (req, res) {
    res.render("shop_desk_add", {"title": "desk", user: req.session.user, deskId:req.params.id});
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

  app.delete('/desk/remove.json', function (req, res) {
    desk.remove(req,res);
  });

  app.get('/desk/findOne.json', function (req, res) {
    desk.findOne(req,res);
  });

  app.get('/admin/users', function (req, res) {

    ac.checkAdmin(req, res, function() {
      res.render("admin_user_list", {user: req.session.user});
    });
  });

  app.get('/admin/user/add', function (req, res) {
    ac.checkAdmin(req, res, function() {
      res.render("admin_user_add", {user: req.session.user, userId: ""});
    });
  });

  app.get('/admin/user/edit/:userId', function (req, res) {
    ac.checkAdmin(req, res, function() {
      res.render("admin_user_add", {user: req.session.user, userId: req.params.userId});
    });
  });

  app.put('/admin/user/add.json', function (req, res) {
    ac.checkAdmin(req, res, function() {
      user.add(req, res);
    });
  });

  app.get('/admin/user/get.json', function (req, res) {
    ac.checkAdmin(req, res, function() {
      user.get(req, res);
    });
  });

  app.post('/admin/user/update.json', function (req, res) {
    ac.checkAdmin(req, res, function() {
      user.update(req, res);
    });
  });

  app.get('/admin/user/list.json', function (req, res) {
    ac.checkAdmin(req, res, function() {
      user.getList(req, res);
    });
  });

  app.delete('/admin/user/remove.json', function (req, res) {
    ac.checkAdmin(req, res, function() {
      user.remove(req, res);
    });
  });

  app.get('/admin/user/updatePassword', function (req, res) {
    res.render("admin_user_updatePassword", {user: req.session.user});
  });

  app.post('/admin/user/updatePassword.json', function (req, res) {
    user.updatePassword(req, res);
  });

  app.post('/admin/user/updatePattern.json', function (req, res) {
    user.updatePassword(req, res);
  });

  app.get('/admin/user/checkPattern.json', function (req, res) {
    user.isPatternRight(req, res);
  });


};
