var phantom = require('phantom');
var q = require('q');

module.exports = function(options) {
  var deferred = q.defer();
  phantom.create(function(ph) {
    return ph.createPage(function(page) {
      return page.open(options.uri, function(status) {
        console.log("SITE OPENED?", status);

        page.includeJs(options.scriptInclude, function() {

          if (options.noConflict) {
            page.evaluate(options.noConflict);
          }

          setTimeout(function() {
            return page.evaluate(options.scriptEvaluate, function(result) {
              console.log('RESOLVING', result);
              deferred.resolve(result);
              //page.render('trends.png')
              ph.exit();
            });
          }, (options.evaluationTimeout || 5000));

        });
      });
    });
  });
  return deferred.promise;
};
