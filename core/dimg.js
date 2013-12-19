

var querystring = require('querystring');


function thumbImage(id, dbName, dbCollection, dbParam, dbId) {
  var https = require('http');
  var qs = require('querystring');
  var url = require('url');
  var params = {
    id: id,
    dbName: dbName,
    dbCollection: dbCollection,
    dbParam: dbParam,
    dbId: dbId
  };
  var content= qs.stringify(params);

  console.log("content : " + content);
  var options={
    host : 'localhost',
    port : 3344,
    path : '/dimg/thumb',
    method:'POST',
    headers:{
      'Content-Type':'application/x-www-form-urlencoded',
      'Content-Length':content.length
    }
  };
  var req = https.request(options,function(res){
    var _data = '';
    res.on('data', function(chunk){
      console.log(chunk);
      _data += chunk;
    });

    res.on('end', function(){
      // 处理返回
      process.stdout.write(_data);
    });
  });

  req.write(content);

  req.end();
};


module.exports.thumbImage = thumbImage;
