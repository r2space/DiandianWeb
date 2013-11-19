
var core     = smart.core
  ,log        = smart.framework.log
  , desk  = require("../apis/desk")
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

  //菜品
  app.get("/menu/item/list", function(req, res) {
    res.render("menu_item_list", {"title": "item", user: req.session.user});
  });

  //桌台
  app.get("/shop/desk/list", function(req, res) {
    res.render("shop_desk_list", {"title": "desk", user: req.session.user});
  });

  app.post('/desk/add.json', function(req, res){
    desk.add(req, res);
  });

};
