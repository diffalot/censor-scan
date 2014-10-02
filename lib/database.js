var level = require('level');
var SubLevel = require('level-sublevel');

var db = SubLevel(level('./data', {valueEncoding:'json'}));
var trends = db.sublevel('trends');
var uris = db.sublevel('uris');
var detections = db.sublevel('detections');

module.exports = {
  db: db,
  trends: trends,
  uris: uris,
  detections: detections
}
