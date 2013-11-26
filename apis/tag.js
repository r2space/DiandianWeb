/**
 * Created with JetBrains WebStorm.
 * User: ZengXR
 * Date: 11/25/13
 * Time: 1:43 PM
 * To change this template use File | Settings | File Templates.
 */

var smart     = require("smartcore")
  , response    = smart.framework.response
  , util    = smart.framework.util
  , errors  = smart.core.errors
  , tag       = require('../controllers/ctrl_tag');

// Tag一览
exports.search = function(req_, res_) {

  var code = "diandian"
    , keywords = req_.query.keywords
    , start = req_.query.start
    , limit = req_.query.count;

  tag.search(code, keywords, start, limit, function(err, result) {
    response.send(res_, err, result);
  });
};