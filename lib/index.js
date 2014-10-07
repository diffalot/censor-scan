'use strict';

var q = require('q');
var moment = require('moment');

var payloads = require('./payloads');

var db = require('./database');

var scanSummary = undefined;
var scanResults = undefined;

var countries = require('./util').countries;

scanForLinks();
function scanForLinks(){
  payloads.getCountries()
  .then(function setCountries(scrapedCountries){
    console.log('COUNTRIES ARRAY POPULATED WITH '+scrapedCountries.length+' ITEMS', scrapedCountries)
    countries.setCountries(scrapedCountries);
  })
  .then(function() {
    return getTrendsForCountries()
  })
  .then(function(result){
    console.log('ALL DONE', result)
    console.log(result.trends.trends)
    setTimeout(scanForLinks, 60*1000);
  });
}

function getTrendsForCountries(){
  // TODO: turn this into a queued loop through all countries
  return payloads.getLatestTrends(countries.getCountries()[0].id)
  .then(function storeTrendsForCountry(trends){
    //trends.trends = trends.trends.slice(0,2);
    var deferred = q.defer()
    console.log('GOT TRENDS', trends)
    var key = trends.country.replace(' ', '+').toLowerCase()+'-'+trends.date
    db.trends.put(key, trends, function(err){
      console.log('STORING TRENDS')
      if (err) console.log('STORING TRENDS FAILED', err);
      deferred.resolve(trends);
    });
    return deferred.promise;
  })
  .then(function(trends){
    return loopTrendsForStories({trends:trends})
  })
}

function loopTrendsForStories(options){
  var trends = options.trends
    console.log('LOOPING TRENDS')
    var storiesQueue = [];
    for (var i = 0; i < trends.trends.length; i++){
      var trend = trends.trends[i];
      console.log('QUEUING STORIES', trend.name)
      storiesQueue.push(function(options){
        var trend = options.trend;
        console.log('GETTING STORIES', trend.uri)
        return payloads.getStoriesForTrend(trend.uri)
        .then(function(uris){
          var deferred = q.defer();
          uris.forEach(function(uri){
            uri.trend = trend.name;
            db.updateUri(uri)
          });
          deferred.resolve(uris);
          return deferred.promise;
        })
        .then(function(uris){
          //uris = uris.slice(0,2)
          return loopUrisForTitles({uris:uris,trends:trends, trend: trend})
        })
      })
    }
    return storiesQueue.slice(1).reduce(q.when, q(storiesQueue[0]({trend:trends.trends[0]})))
  }

function loopUrisForTitles(options){
  var uris = options.uris;
  var trends = options.trends;
  var trend = options.trend;
  if (trends.trends[trends.trends.indexOf(trend)+1]) var nextTrend = trends.trends[trends.trends.indexOf(trend)+1];
  else var nextTrend = null;
  console.log('GOT URIS', uris)
  var titlesQueue = [];
  for (var i = 0; i < uris.length; i++) {
    var uri = uris[i];
    console.log('QUEUING TITLE', uri.uri)
    titlesQueue.push(function(options){
      var uri = options.uri;
      var uris = options.uris;
      console.log('GETTING TITLE', uri.uri)
      return payloads.getUriTitle(uri.uri)
      .timeout(60*1000)
      .then(function(title){
        var deferred = q.defer();
        console.log("URI TITLE", title, uri.uri);
        uri.title = title;
        db.updateUri(uri);
        if (uris[uris.indexOf(uri)+1]) var nextUri = uris[uris.indexOf(uri)+1];
        else var nextUri = null;
        deferred.resolve({uri:nextUri, uris:uris});
        return deferred.promise;
      }, function(){
        var deferred = q.defer();
        db.updateUri(uri)
        if (uris[uris.indexOf(uri)+1]) var nextUri = uris[uris.indexOf(uri)+1];
        else var nextUri = null;
        deferred.resolve({uri:nextUri, uris:uris});
        return deferred.promise;
      });
    })
  };
  return titlesQueue.slice(1).reduce(q.when, q(titlesQueue[0]({uri:uris[0], uris:uris}))).then(function(result){
    console.log("DONE", result)
    var deferred = q.defer();
    deferred.resolve({uris:result,trends:trends,trend:nextTrend})
    return deferred.promise;
  });
}


scanUris();
function scanUris(){
  db.getUnscannedUris()
  .then(function(uris){
    console.log('SCANNING URIS', uris)
    var uriScanQueue = [];
    for (var i = 0; i < uris.length; i++) {
      console.log("QUEUING", uris[i].title)
      uriScanQueue.push(function(options){
        var uri = options.uri;
        var currentUri = options.uri;
        if (!uri.scanResults) uri.scanResults = [];
        if (!uri.scanCount) uri.scanCount = 0;
        console.log("SCANNING", uri.title)
        return payloads.getUriTitle(uri.uri)
        .timeout(60*1000)
        .then(function(title){
          var deferred = q.defer();
          debugger;
          uri.scanCount = uri.scanCount+1;
          if (title === uri.title) {
            uri.scanResults.push({time:moment.utc().format(), urlAccessible: true})
            console.log("ACCESSED", uri.title)
          } else {
            uri.scanResults.push({time:moment.utc().format(), urlAccessible: false})
            console.log("COULD NOT ACCESS", uri.title)
          }
          db.updateUri(uri);
          debugger;
          if (uris[uris.indexOf(currentUri)+1]) var nextUri = uris[uris.indexOf(currentUri)+1];
          else var nextUri = null;
          debugger;
          deferred.resolve({uri:nextUri,uris:uris});
          return deferred.promise;
        }, function(){
          console.log("COULD NOT LOAD", uri.title)
          var deferred = q.defer();
          if (uris[uris.indexOf(currentUri)+1]) var nextUri = uris[uris.indexOf(currentUri)+1];
          else var nextUri = null;
          deferred.resolve({uri:nextUri,uris:uris});
          return deferred.promise;
        })
      });
    };
    return uriScanQueue.slice(1).reduce(q.when, q(uriScanQueue[0]({uri:uris[0], uris:uris})))
  })
  .then(function(result){
    console.log('URI SCAN FINISHED',result);
    setTimeout(scanUris, 60*1000)
  })
}

module.exports = {
  scanResults: function() { return scanResults; },
  scanSummary: function() { return scanSummary; }
};
