var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');

exports.headers = headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10, // Seconds.
  'Content-Type': "text/html"
};

exports.serveAssets = function(res, asset, callback) {
  fs.readFile(asset, {encoding: 'utf8'}, function(err, data){
    if(err){
      res.writeHead(404,exports.headers);
      res.end();
    }
    exports.headers['Content-Type'] = getContentType(asset);
    res.writeHead(200,exports.headers);
    res.end(data);
  })
};

var getContentType = function(url){
  var allowedFileTypes = {'.css': 'text/css' , '.html': 'text/html'};
  var extension = (url = url.substr(1 + url.lastIndexOf("/")).split('?')[0]).substr(url.lastIndexOf("."));

  if(extension in allowedFileTypes){
    return allowedFileTypes[extension];
  }

  return 'text/html';
}