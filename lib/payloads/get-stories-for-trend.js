var phantomScraper = require('phantom-scraper');
var q = require('q');
var moment = require('moment');
var countryList = require('iso-3166-country-list');
var countries = require('../util').countries;

var payload = function () {
  console.log('loading page')
  var stories = [];
  jQuery('#ires li table tbody tr td h3 a').each(function(ix, element){
    var uri = jQuery(element).attr('href').replace('/url?q=', '').split('&')[0];
    stories.push({uri:uri});
  })
  return stories;
};

var options = {
  scriptInclude: "//code.jquery.com/jquery-2.1.1.min.js",
  scriptEvaluate: payload,
  evaluationTimeout: 5000,
  noConflict: function() { $.noConflict(); }
};

var scrape = function(searchUri){
  //options.console = true;
  options.uri = searchUri+"&tbm=nws";
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
