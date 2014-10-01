var fs = require('fs');

var payloads = {};
var scrapers = {};

var camelCase = function(string) {
  return string.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase(); })
};

fs.readdirSync(__dirname).forEach(function(file) {
  if (file == "index.js") return;
  var name = camelCase(file.substr(0, file.indexOf('.')));
  payloads[name] = require('./'+file);
  scrapers[name] = payloads[name].scrape;
});

module.exports = scrapers; //{ getCountries: function() { return null } }
