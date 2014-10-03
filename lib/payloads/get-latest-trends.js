var phantomScraper = require('phantom-scraper');
var q = require('q');
var moment = require('moment');
var countryList = require('iso-3166-country-list');
var countries = require('../util').countries;

var payload = function () {
  var trends = [];
  var date = jQuery('.hottrends-trends-list-date-container').attr('id');
  jQuery('.hottrends-trends-list-date-container').first()
  .find('.hottrends-single-trend-container')
  .each(function(ix, element){
    var uri = 'https://www.google.com'+jQuery(element)
    .find('.hottrends-single-trend-title-container a')
    .attr('href');
    var name = jQuery(element)
    .find('.hottrends-single-trend-title-container a > span')
    .text()
    var searchCount = jQuery(element)
    .find('.hottrends-single-trend-info-line-number')
    .text().replace(',','').replace('+','');
    if (name && id && searchCount) trends.push({name:name,uri:uri, searchCount:searchCount});
  });
  return {date:date,trends:trends};
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
  return phantomScraper(options)
  .then(function(trends){
    trends.date = moment.utc(trends.date, 'YYYYMMDD').format();
    trends.scanFinished = moment.utc().format();
    trends.country = countries.getCountryByPageID(pageID);
    return trends;
  });
};

module.exports = {
  options: options,
  payload: payload,
  scrape: scrape
};
