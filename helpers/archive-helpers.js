var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var request = require('request');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../web/archives/sites'),
  list: path.join(__dirname, '../web/archives/sites.txt')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj){
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(cb){
  fs.readFile(exports.paths.list,{'encoding': 'utf8'} , function(err, data){
    cb(data.split('\n'));
  })
};

exports.isUrlInList = function(url, cb){
  fs.readFile(exports.paths.list,{'encoding': 'utf8'} , function(err, data){
    cb(data.indexOf(url) > -1);  
  })
};

exports.addUrlToList = function(url, cb){
  fs.appendFile(exports.paths.list, url + '\n', function (err) {
    cb(err ? false : true);
  });
};

exports.isUrlArchived = function(site, cb){
  cb(fs.existsSync(exports.paths.archivedSites + site));
};

exports.downloadUrls = function(defaultUrls){
  if(!defaultUrls || !defaultUrls.length){
    exports.readListOfUrls(function(urls){
      urls.forEach(function(url){
        exports.isUrlArchived(url, function(bool){
          if(!bool){
            exports.download(url);
          }
        });
      });
    });
  } else {
    defaultUrls.forEach(function(url){
      exports.download(url);
    });
  }
};

exports.download = function(url){
  request('http://' + url, function(err, response, body){
    if (err) throw err; 
    if (response.statusCode === 200) {
      fs.writeFile(exports.paths.archivedSites + '/' + url, body);
    }
  });
};





















