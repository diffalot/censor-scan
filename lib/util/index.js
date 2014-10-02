var storedCountries = undefined;
var countries = {};
countries.getCountries = function(){ return storedCountries };
countries.setCountries = function(countries){
  storedCountries = countries;
}

countries.getCountryByPageID = function(pageID){
  for (var i=0; i<storedCountries.length; i++) {
    if (storedCountries[i].id === pageID) return storedCountries[i].name;
  }
  return undefined;
};

module.exports = {
  countries: countries
}
