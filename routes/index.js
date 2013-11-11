

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

//  app.get("", function(req, res) {
//
//  });

};
