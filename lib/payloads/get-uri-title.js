var phantomScraper = require('phantom-scraper');
var q = require('q');
var moment = require('moment');
var countryList = require('iso-3166-country-list');
var countries = require('../util').countries;

var payload = function () {
  console.log("title", document.title)
  return document.title;
};

var options = {
  scriptInclude: "//code.jquery.com/jquery-2.1.1.min.js",
  scriptEvaluate: payload,
  evaluationTimeout: 5000,
  noConflict: function() { $.noConflict(); }
};

var scrape = function(uri){
  //options.console = true;
  options.uri = uri;
  return phantomScraper(options)
  /*
  .then(function(stories){
    console.log('GOT STORIES', stories)
    return stories;
  });
  */
};

module.exports = {
  options: options,
  payload: payload,
  scrape: scrape
};
