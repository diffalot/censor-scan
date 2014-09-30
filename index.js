var phantom = require('phantom');
var q = require('q');

var scrape = function(options) {
  var deferred = q.defer();
  phantom.create(function(ph) {
    return ph.createPage(function(page) {
      return page.open(options.uri, function(status) {
        console.log("SITE OPENED?", status);

        page.includeJs('//code.jquery.com/jquery-2.1.1.min.js', function() {
          setTimeout(function() {
            return page.evaluate(function() {

              var trends = [];
              $trending = $('.landing-page-hottrends-trends-list-container > div')
              .each(function(ix, element){
                trends.push($(element).attr('id'))
              });

              return {
                trends: trends
              };
            }, function(result) {
              console.log('RESOLVING', result);
              deferred.resolve(result);
              page.render('trends.png')
              ph.exit();
            });
          }, 5000);

        });
      });
    });
  });
  return deferred.promise;
};


var result = scrape({
  uri: "https://www.google.com/trends/"
})
.then(function(result){
  console.log('RESOLVED', result);
  return result;
});
