var payloads = require('./payloads');

var scanSummary = undefined;
var scanResults = undefined;

var countries = undefined;
payloads.getCountries()
.then(function(result){
  console.log('COUNTRIES ARRAY POPULATED WITH '+result.length+' ITEMS', result)
  countries = result;
})
.then(function(){
  payloads.getLatestTrends(countries[0].id)
  .then(function(result){
    console.log('GOT TRENDS', result)
  })
});

module.exports = {
  scanResults: function() { return scanResults; },
  scanSummary: function() { return scanSummary; }
};
