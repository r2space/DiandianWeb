var fs        = require("fs")
  , os        = require("os")
  , path      = require('path')
  , exec      = require("child_process").exec
  , home      = path.resolve(__dirname , "..");


/**
 * 执行sh命令
 * @param command 命令
 * @param callback 执行完命令后的回调函数
 * @returns {*}
 */
function runCommand(command, callback) {

  var child = exec(command, function (error, stdout, stderr) {
    callback(error, stdout);
  });

  return child;
};


/**
 * 变换工作路径
 */
process.chdir(home);
if (!fs.existsSync("coverage")) {
  fs.mkdirSync("coverage");
}

/**
 * 清除文件，生成converage代码，并执行测试case
 */
var rm = "Windows_NT" == os.type() ? "rd /S /Q coverage" : "rm -rf coverage";
runCommand(rm, function(err, result){
  if (err) {
    return console.log(err);
  }

  // 创建文件夹
  fs.mkdirSync("coverage");

  // 生成converage代码
  var routes      = "jscoverage routes/ coverage/routes/";
  var api         = "jscoverage api/ coverage/api/";
  var controllers = "jscoverage controllers/ coverage/controllers/";
  var modules     = "jscoverage modules/ coverage/modules/";
  var core        = "jscoverage core/ coverage/core/";
  runCommand(routes, function(err, result){});
  runCommand(api, function(err, result){});
  runCommand(controllers, function(err, result){});
  runCommand(modules, function(err, result){});
  runCommand(core, function(err, result){});

  // 执行测试代码，生成报告
  var test = "mocha -R html-cov test/*/* --coverage > coverage/coverage.html";

  // 在环境变量里添加测试标识，数据库连接时根据该标识切换要使用的数据库
  process.env['TEST'] = 1;
  runCommand(test, function(err, result){
    if (err) {
      return console.log(err);
    }

    // 执行成功
    console.log("OK!");
  });

});
