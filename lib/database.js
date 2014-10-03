var level = require('level');
var SubLevel = require('level-sublevel');
var version = require('level-version');
var merge = require('merge');

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
      uris.put(newUri.uri, merge(newUri, oldUri));
    }
    return (err, merge(newUri, oldUri))
  });
}

module.exports = {
  db: db,
  trends: trends,
  uris: uris,
  updateUri: updateUri,
  detections: detections
}
