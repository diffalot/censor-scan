var q = require('q');
var moment = require('moment');

var payloads = require('./payloads');

var db = require('./database');

var scanSummary = undefined;
var scanResults = undefined;

var countries = require('./util').countries;
payloads.getCountries()
.then(function setCountries(scrapedCountries){
  console.log('COUNTRIES ARRAY POPULATED WITH '+scrapedCountries.length+' ITEMS', scrapedCountries)
  countries.setCountries(scrapedCountries);
})
.then(function getTrendsForCountries(){
  // TODO: turn this into a queued loop through all countries
  return payloads.getLatestTrends(countries.getCountries()[0].id)
  .then(function storeTrendsForCountry(trends){
    var deferred = q.defer()
    console.log('GOT TRENDS', trends)
    var key = trends.country.replace(' ', '+').toLowerCase()+'-'+trends.date
    db.trends.put(key, trends, function(err){
      if (err) console.log('STORING TRENDS FAILED', err);
      deferred.resolve(trends);
    });
    return deferred.promise;
  })
  .then(function getNewsStoriesForTrends(trends){
    return trends
  })
})
.then(function(result){
  console.log('ALL DONE', result)
});

module.exports = {
  scanResults: function() { return scanResults; },
  scanSummary: function() { return scanSummary; }
};
