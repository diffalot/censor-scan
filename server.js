var express = require('express');
var exphbs  = require('express-handlebars');

var scraper = require('./');

var app = express();

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.get('/', function(req,res,next){
  res.render('results', {
    scanSummary: scraper.scanSummary()
  });
});

var server = app.listen(3000, function() {
  console.log('Listening on port %d', server.address().port);
});
