var phantomScraper = require('phantom-scraper');
var q = require('q');
var countryList = require('iso-3166-country-list')

var payload = function () {
  var trends = [];
  console.log(jQuery('.hottrends-trends-list-date-container').html())
  jQuery('.hottrends-trends-list-date-container').first()
  .find('.hottrends-single-trend-container')
  .each(function(ix, element){
    var uri = 'https://www.google.com'+jQuery(element)
    .find('.hottrends-single-trend-title-container a')
    .attr('href');
    var name = jQuery(element)
    .find('.hottrends-single-trend-title-container a > span')
    .text()
    if (name && id) trends.push({name:name,uri:uri});
  });
  return trends;
};

var options = {
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

var scrape = function(pageID){
  options.console = true;
  options.uri = "https://www.google.com/trends/hottrends#pn="+pageID;
  return phantomScraper(options);
};

module.exports = {
  options: options,
  payload: payload,
  scrape: scrape
};
