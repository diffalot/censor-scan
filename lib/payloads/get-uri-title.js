var phantomScraper = require('phantom-scraper');

var payload = function () {
  return document.title;
};

var options = {
  scriptInclude: "",
  scriptEvaluate: payload,
  evaluationTimeout: 5000,
  noConflict: function() { }
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
