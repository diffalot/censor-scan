'use strict';

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
    console.log('GETTING STORIES', trends.trends[0].uri)
    return payloads.getStoriesForTrend(trends.trends[0].uri)
    .then(function(uris){
      uris.forEach(function(uri, index){
        uri.trend = trends.trends[0].name;
      });
      return uris
    });
  })
})
.then(function(uris){
  uris.forEach(function(uri, index){
    db.updateUri(uri)
  });
  return uris;
})
.then(function(uris){
  console.log('GOT URIS', uris)
  var deferred = q.defer();
  var titlesQueue = [];
  uris.forEach(function(uri, index){
    console.log('QUEUING TITLE', uri.uri)
    titlesQueue.push(function(uris){
      console.log('GETTING TITLE', uri.uri)
      return payloads.getUriTitle(uri.uri)
      .then(function(title){
        var deferred = q.defer();
        console.log("URI TITLE", title, uri.uri);
        uri.title = title;
        db.updateUri(uri);
        deferred.resolve(uris);
        return deferred.promise;
      }).timeout(30*1000);
    })
  });
  var runQueue = q(titlesQueue.shift());
  titlesQueue.forEach(function(func){
    runQueue = runQueue.then(func);
  })
  return runQueue
  .then(function(){
    return uris;
  });
})
.then(function(result){
  console.log('ALL DONE', result)
});

module.exports = {
  scanResults: function() { return scanResults; },
  scanSummary: function() { return scanSummary; }
};
