var phantomScraper = require('phantom-scraper');
var q = require('q');

var payload = function() {
  var countries = [];
  jQuery('.landing-page-hottrends-trends-list-container > div')
  .each(function(ix, element){
    countries.push(jQuery(element).attr('id'))
  });
  return {
    trends: countries
  };
};

var options = {
  uri: "https://www.google.com/trends/",
  scriptInclude: "//code.jquery.com/jquery-2.1.1.min.js",
  scriptEvaluate: payload,
  evaluationTimeout: 5000,
  noConflict: function() { $.noConflict(); }
};

var scrape = function() {
  return phantomScraper(options)
}

module.exports = {
  options: options,
  payload: payload,
  scrape: scrape
};
