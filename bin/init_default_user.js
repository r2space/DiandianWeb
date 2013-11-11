var cmd = require("./command");

var data = {
  "uid" : "admin",
  "password" : "e3cfa171629240c8991f31af049b8b22a24c90ac4dc49ceb202faf7fb50bde07",
  "type" : 2,
  "lang" : "ja",
  "createat" : new Date(),
  "createby" : "script",
  "valid" : 1,
  "authority" : {
    "approve" : 0,
    "notice" : 0,
    "contents" : 0
  },
  "name" : {
    "name_zh" : "admin"
  },
  "active" : 1,
  "timezone" : "GMT+09:00"
}

cmd.insertData("diandian", "users", data, function(err, result){
  if (err) {
    return console.log(err);
  }
  console.log("insert data ok");
});
