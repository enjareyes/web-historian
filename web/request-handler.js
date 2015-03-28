var path = require('path');
var archive = require('../helpers/archive-helpers.js');
// require more modules/folders here!
var helper = require('./http-helpers.js');
var qs = require('querystring');

exports.handleRequest = function (req, res) {
  if(req.method === 'GET'){
    if(req.url.indexOf('www.') > -1){
      var site = req.url.substring(req.url.lastIndexOf('/'));
      helper.serveAssets(res, archive.paths.archivedSites + site);
    } else {
      if(req.url === '/') req.url = '/index.html';
      helper.serveAssets(res, archive.paths.siteAssets + req.url)
    }

  } else if(req.method === 'POST'){
    var x = '';

    req.on('data', function(data){
      x += data;
    });

    req.on('end', function(){
      x = qs.parse(x);
      archive.addUrlToList(x.url);
      res.writeHead(302, helper.headers);
      res.end();
    });
  }
};
