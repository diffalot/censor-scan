
var scanSummary = undefined;
var scanResults = undefined;

var payloads = require('./payloads');

payloads.getCountries()
.then(function(result){
  console.log('SCRAPE RESULTS', result);
  scanSummary = result;
  return result;
});

module.exports = {
  scanResults: function() { return scanResults; },
  scanSummary: function() { return scanSummary; }
};
