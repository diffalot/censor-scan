var q = require('q');
var moment = require('moment');

var payloads = require('./payloads');

var db = require('./database');

var scanSummary = undefined;
var scanResults = undefined;

var countries = undefined;
payloads.getCountries()
.then(function(result){
  console.log('COUNTRIES ARRAY POPULATED WITH '+result.length+' ITEMS', result)
  countries = result;
})
.then(function(){
  return payloads.getLatestTrends(countries[0].id)
  .then(function(trends){
    var deferred = q.defer()
    console.log('GOT TRENDS', trends)
    db.trends.put(trends.date, {
      scanFinished: trends.scanFinished,
      trends: trends.trends
    }, function(err){
      if (err) console.log('STORING TRENDS FAILED', err);
      deferred.resolve(trends);
    });
    return deferred.promise;
  })
})
.then(function(result){
  console.log('ALL DONE', result)
});

module.exports = {
  scanResults: function() { return scanResults; },
  scanSummary: function() { return scanSummary; }
};
