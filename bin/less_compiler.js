var lessDir = __dirname + '/../public/stylesheets'
  , cssDir  = __dirname + '/../public/stylesheets';

var less = require('less')
  , ph = require('path')
  , fs = require('fs')
  , compile
  , watch;

/**
 * 监视less文件
 */
watch = function(filename) {

  var path = ph.join(lessDir, filename);
  if(!filename.match(/\.less$/) || !fs.statSync(path).isFile()) {
    return;
  }

  fs.watchFile(path, {persistent: true, interval: 500}, function(curr, prev) {
    compile(path);
  });

  compile(path);
}

/**
 * 编译less文件
 */
compile = function(path) {

  var lessFileName = ph.basename(path);

  var lessParser = new less.Parser({
    paths: [ ph.dirname(path) ],
    filename: lessFileName
  });

  var contents = fs.readFileSync(path).toString();
  lessParser.parse(contents, function(err, tree){
    if(err) {
      throw new Error(err);
    }

    var cssFilename = lessFileName.replace(/less$/, 'css');
    fs.writeFileSync(ph.join(cssDir, cssFilename), tree.toCSS({yuicompress: false}));
  });
}

// TODO: 新加文件，删除文件，重命名文件时的对应

fs.readdirSync(lessDir).forEach(watch);



