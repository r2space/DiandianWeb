
var response  = smart.framework.response
  , util      = smart.framework.util
  , errors    = smart.framework.errors
  , context   = smart.framework.context
  , log       = smart.framework.log
  , menu      = require('../controllers/ctrl_menu');

// 获取指定菜单
exports.findOne = function(req_, res_) {

  var code = req_.session.user.companycode
    , uid = req_.session.user._id
    , menuId = req_.query.id;

  menu.get(code, uid, menuId, function(err, result) {
    response.send(res_, err, result);
  });
};

/**
 * 获取一览
 * @param {Object} req 请求
 * @param {Object} res 响应
 */
exports.list = function(req, res) {

  var handler = new context().bind(req, res);
  log.operation("begin: get menu list.", handler.uid);

  menu.list(handler, function(err, result) {

    log.operation("finish: get menu list.", handler.uid);
    response.send(res, err, result);
  });
};

// 获取指定字段一览
exports.partialList = function(req_, res_) {

  var code = req_.session.user.companycode
    ,filed = req_.query.filed
    , condition = {
      valid: 1,
      status: 1
    };

  menu.partialList(code, condition, filed, function(err, result) {
    response.send(res_, err, result);
  });
};

// 添加
exports.add = function(req_, res_) {

  var code = req_.session.user.companycode
    , uid = req_.session.user._id;

  menu.add(code, uid, req_.body, function(err, result) {
    response.send(res_, err, result);
  });
};

// 更新
exports.update = function(req_, res_) {

  var code = req_.session.user.companycode
    , uid = req_.session.user._id;

  menu.add(code, uid, req_.body, function(err, result) {
    response.send(res_, err, result);
  });
};

// 删除·
exports.remove = function(req_, res_) {

  var code = req_.session.user.companycode
    , uid = req_.session.user._id;

  menu.remove(code, uid, req_.body.id, function(err, result) {
    response.send(res_, err, result);
  });
};

exports.appList = function(req_, res_){
  var code = req_.session.user.companycode || "diandian"
  var condition = {"status": 1};
  menu.appList(code, condition, 0, 10 , function(err, result) {
    response.send(res_, err, result);
  });
};

exports.setting = function (req_, res_) {

  return res_.json(
    {
      data: {
        total: 3,
        items: [
          {
            name: "招牌菜",
            page: 2,
            items: [
              {
                "name": "茶香虾",
                "price": "800",
                "index": "1",
                "row": 2,
                "column": 2,
                "type": "4",
                "image": "茶香虾.jpg",
                "_id": "10001"
              },
              {
                "name": "百豆会",
                "price": "900",
                "index": "1",
                "row": 1,
                "column": 1,
                "type": "4",
                "image": "百豆会.jpg",
                "_id": "10002"
              },
              {
                "name": "白斩鸡",
                "price": "2200",
                "index": "1",
                "row": 1,
                "column": 1,
                "type": "5",
                "image": "白斩鸡.jpg",
                "_id": "10003"
              },
              {
                "name": "干锅千叶豆腐",
                "price": "11100",
                "index": "1",
                "row": 1,
                "column": 1,
                "type": "6",
                "image": "鲅鱼饼子29元.jpg",
                "_id": "10004"
              },
              {
                "name": "干锅千叶豆腐",
                "price": "11100",
                "index": "1",
                "row": 1,
                "column": 1,
                "type": "6",
                "image": "鲅鱼饼子29元.jpg",
                "_id": "10005"
              },
              {
                "name": "干锅千叶豆腐",
                "price": "11100",
                "index": "1",
                "row": 1,
                "column": 1,
                "type": "6",
                "image": "鲅鱼饼子29元.jpg",
                "_id": "10006"
              },
              {
                "name": "茶香虾",
                "price": "800",
                "index": "1",
                "row": 2,
                "column": 2,
                "type": "4",
                "image": "茶香虾.jpg",
                "_id": "10007"
              },
              {
                "name": "百豆会",
                "price": "900",
                "index": "1",
                "row": 1,
                "column": 1,
                "type": "4",
                "image": "百豆会.jpg",
                "_id": "10008"
              },
              {
                "name": "白斩鸡",
                "price": "2200",
                "index": "1",
                "row": 1,
                "column": 1,
                "type": "5",
                "image": "白斩鸡.jpg",
                "_id": "10009"
              },
              {
                "name": "干锅千叶豆腐",
                "price": "11100",
                "index": "1",
                "row": 1,
                "column": 1,
                "type": "6",
                "image": "鲅鱼饼子29元.jpg",
                "_id": "10010"
              },
              {
                "name": "干锅千叶豆腐",
                "price": "11100",
                "index": "1",
                "row": 1,
                "column": 1,
                "type": "6",
                "image": "鲅鱼饼子29元.jpg",
                "_id": "10011"
              },
              {
                "name": "干锅千叶豆腐",
                "price": "11100",
                "index": "1",
                "row": 1,
                "column": 1,
                "type": "6",
                "image": "鲅鱼饼子29元.jpg",
                "_id": "10012"
              }
            ]
          },
          {
            name: "川菜",
            page: 3,
            items: [
              {
                "name": "茶香虾",
                "price": "800",
                "index": "1",
                "row": 3,
                "column": 3,
                "type": "4",
                "image": "茶香虾.jpg",
                "_id": "10013"
              },
              {
                "name": "百豆会",
                "price": "900",
                "index": "1",
                "row": 3,
                "column": 3,
                "type": "4",
                "image": "百豆会.jpg",
                "_id": "10014"
              },
              {
                "name": "白斩鸡",
                "price": "2200",
                "index": "1",
                "row": 3,
                "column": 3,
                "type": "5",
                "image": "白斩鸡.jpg",
                "_id": "10015"
              },
              {
                "name": "干锅千叶豆腐",
                "price": "11100",
                "index": "1",
                "row": 3,
                "column": 3,
                "type": "6",
                "image": "鲅鱼饼子29元.jpg",
                "_id": "10016"
              }
            ]
          },
          {
            name: "东北菜",
            page: 2,
            items: [
              {
                "name": "茶香虾",
                "price": "800",
                "index": "1",
                "row": 1,
                "column": 1,
                "type": "4",
                "image": "茶香虾.jpg",
                "_id": "10017"
              },
              {
                "name": "百豆会",
                "price": "900",
                "index": "1",
                "row": 1,
                "column":1,
                "type": "4",
                "image": "百豆会.jpg",
                "_id": "10018"
              },
              {
                "name": "白斩鸡",
                "price": "2200",
                "index": "1",
                "row": 1,
                "column": 1,
                "type": "5",
                "image": "白斩鸡.jpg",
                "_id": "10019"
              },
              {
                "name": "干锅千叶豆腐",
                "price": "11100",
                "index": "1",
                "row": 1,
                "column": 1,
                "type": "6",
                "image": "鲅鱼饼子29元.jpg",
                "_id": "10020"
              },
              {
                "name": "茶香虾",
                "price": "800",
                "index": "1",
                "row": 1,
                "column": 1,
                "type": "4",
                "image": "茶香虾.jpg",
                "_id": "10021"
              },
              {
                "name": "百豆会",
                "price": "900",
                "index": "1",
                "row": 1,
                "column":1,
                "type": "4",
                "image": "百豆会.jpg",
                "_id": "10022"
              },
              {
                "name": "白斩鸡",
                "price": "2200",
                "index": "1",
                "row": 1,
                "column": 1,
                "type": "5",
                "image": "白斩鸡.jpg",
                "_id": "10023"
              },
              {
                "name": "干锅千叶豆腐",
                "price": "11100",
                "index": "1",
                "row": 1,
                "column": 1,
                "type": "6",
                "image": "鲅鱼饼子29元.jpg",
                "_id": "10024"
              },{
                "name": "茶香虾",
                "price": "800",
                "index": "1",
                "row": 1,
                "column": 1,
                "type": "4",
                "image": "茶香虾.jpg",
                "_id": "10025"
              },
              {
                "name": "百豆会",
                "price": "900",
                "index": "1",
                "row": 1,
                "column":1,
                "type": "4",
                "image": "百豆会.jpg",
                "_id": "10026"
              },
              {
                "name": "白斩鸡",
                "price": "2200",
                "index": "1",
                "row": 1,
                "column": 1,
                "type": "5",
                "image": "白斩鸡.jpg",
                "_id": "10027"
              },
              {
                "name": "干锅千叶豆腐",
                "price": "11100",
                "index": "1",
                "row": 1,
                "column": 1,
                "type": "6",
                "image": "鲅鱼饼子29元.jpg",
                "_id": "10028"
              }
            ]
          }
        ]
      }});
};