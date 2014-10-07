var level = require('level');
var SubLevel = require('level-sublevel');
var version = require('level-version');
var merge = require('deepmerge');
var q = require('q');

var db = version(SubLevel(level('./data', {valueEncoding:'json'})));
var trends = db.sublevel('trends');
var uris = db.sublevel('uris');
var detections = db.sublevel('detections');

var updateUri = function updateUri(newUri){
  uris.get(newUri.uri, function(err, oldUri){
    //if (oldUri) console.log('UPDATING', oldUri, newUri);
    if (err) {
      if (err.notFound) {
        uris.put(newUri.uri, newUri);
      } else {
        console.log('UPDATE URI ERROR', err);
      }
    } else {
      uris.put(newUri.uri, merge(oldUri, newUri));
    }
    return (err, merge(oldUri, newUri))
  });
}

var getUnscannedUris = function getUnscannedUris() {
  var deferred = q.defer();
  var unscannedUris = [];
  uris.createReadStream()
  .on('data', function(data){
    if (data.value.title !== undefined && (data.value.scanCount < 3 || !data.value.scanResults)) {
      unscannedUris.push(data.value);
    }
  })
  .on('end', function(){
    deferred.resolve(unscannedUris)
  });
  return deferred.promise;

}

module.exports = {
  db: db,
  trends: trends,
  uris: uris,
  updateUri: updateUri,
  getUnscannedUris: getUnscannedUris,
  detections: detections
}
