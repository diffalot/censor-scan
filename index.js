var phantomScraper = require('./lib/phantom-scraper')

var scanSummary = undefined;
var scanResults = undefined;

var scrapeInjection = function() {
  var trends = [];
  $trending = jQuery('.landing-page-hottrends-trends-list-container > div')
  .each(function(ix, element){
    trends.push(jQuery(element).attr('id'))
  });
  return {
    trends: trends
  };
};

phantomScraper({
  uri: "https://www.google.com/trends/",
  scriptInclude: "//code.jquery.com/jquery-2.1.1.min.js",
  scriptEvaluate: scrapeInjection,
  evaluationTimeout: 5000,
  noConflict: function() { $.noConflict(); }
})
.then(function(result){
  console.log('SCRAPE RESULTS', result);
  scanSummary = result;
  return result;
});

module.exports = {
  scanResults: function() { return scanResults; },
  scanSummary: function() { return scanSummary; }
};
