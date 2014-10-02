var express = require('express');
var exphbs  = require('express-handlebars');
var moment = require('moment');

var scraper = require('./lib');
var db = require('./lib/database');

var app = express();

app.engine('handlebars', exphbs({
  defaultLayout: 'main',
  helpers: {
    prettyDate: function(date) {
      return moment(date).format('dddd, MMMM Do');
    }
  }
}));
app.set('view engine', 'handlebars');

app.get('/', function(req,res,next){
  var trends = [];
  db.trends.createReadStream({limit:25})
  .on('data', function(data){
    console.log(data.key, '=', data.value);
    var value = data.value;
    trends.push({date:data.key, trends: data.value.trends});
  })
  .on('end', function(err,value){
    res.render('results', {
      trends: trends
    });
  });

});

var server = app.listen(3000, function() {
  console.log('Listening on port %d', server.address().port);
});
