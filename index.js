var cheerio = require('cheerio');
var superagent = require('superagent');
var _ = require('lodash');
var fs = require('fs');
var originUrl = null;

function getFileList(url, destinationPath, depth) {
  superagent.get(url).end(function(err, res) {
    if (!_.endsWith(url, '/')) {
      fs.writeFileSync(destinationPath + '/' + url.replace(originUrl, ''), res.text);
    } else {
      if (url != originUrl) {
        fs.mkdirSync(destinationPath + '/' + url.replace(originUrl, ''), '0777');
      }
      var htmlDom = cheerio.load(res.text)('a[href]');
      _.each(htmlDom, function(item) {
        var fileName = item.attribs['href'];
        if (fileName === '../') {
          return;
        }
        getFileList(url + '/' + fileName, destinationPath, depth++);
      })
    }
  });
}

exports.default = function(url, destinationPath) {
  originUrl = url;
  getFileList(url, destinationPath, 0)
}
