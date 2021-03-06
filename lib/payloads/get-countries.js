var phantomScraper = require('phantom-scraper');
var q = require('q');
var countryList = require('iso-3166-country-list')

var payload = function () {
  var countries = [];
  jQuery('#geo-picker-menu > div')
  .each(function(ix, element){
    var name = jQuery(element).data('button-caption');
    var id = jQuery(element).data('id');
    if (name && id) countries.push({name:name,id:id});
  });
  return countries;
};

var options = {
  uri: "https://www.google.com/trends/hottrends",
  scriptInclude: "//code.jquery.com/jquery-2.1.1.min.js",
  scriptEvaluate: payload,
  evaluationTimeout: 5000,
  noConflict: function() { $.noConflict(); }
};

/*
var scriptToString = function() {
  var deferred = q.defer();
  browserifyFunction(payload).bundle(function(err, src){
    options.scriptEvaluate = src.toString();
    deferred.resolve();
  })
  return deferred.promise
};
*/

var scrape = function(){
  var deferred = q.defer();
  phantomScraper(options).then(function(countries){
    for (var i = 0; i < countries.length; i++) {
      countries[i].code = countryList.code(countries[i].name);
    }
    deferred.resolve(countries);
  });
  return deferred.promise;
};

module.exports = {
  options: options,
  payload: payload,
  scrape: scrape
};
