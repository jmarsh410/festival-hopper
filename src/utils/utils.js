/* jshint ignore:start */

function normalizeBreweryBeers(json, bucket = 0){
  // code for undocumented api call
  const array = json.response.beers.items;

  // code for the documented api call
  // const array = json.response.brewery.beer_list.items;

  let beers = [];
  array.forEach(function(obj, i){
    const normalizedBeer = {
      id: obj.beer.bid,
      name: obj.beer.beer_name,
      brewery: obj.brewery.brewery_name,
      image: obj.beer.beer_label,
      description: '',
      rating: 0,
      isCheckedIn: false,
      isOpen: false,
      checked: false,
      bucket: bucket,
      index: i,
    };
    beers.push(normalizedBeer);
  });
  return beers;
}

const utils = {
  generateId(size) {
    if (typeof size !== 'number') {
      size = 5;
    }
    var value = '',
        chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
        length = chars.length;
    for (var i = 0; i < size; ++i) {
      value += chars.charAt(Math.floor(Math.random() * length));
    }
    return value;
  },
  generateCheckInUrl(){
    return 'https://api.untappd.com/v4/checkin/add?access_token=' + localStorage.userToken;
  },
  // lists the beers that a brewery has
  generateBreweryInfoUrl(breweryId, offset = 0){
    // brewery/beer_list/BREWERY_ID
    // there is an undocumented api endpoint that the untappd website uses which can be used to get a brewery's beers
    // this endpoint is subject to removal/changes since it is undocumented
    return 'https://api.untappd.com/v4/brewery/beer_list/' + breweryId + '?access_token=' + localStorage.userToken + '&offset=' + offset;

    // documented api call https://untappd.com/api/docs#breweryinfo
    // return 'https://api.untappd.com/v4/brewery/info/'+ breweryId + '?access_token=' + localStorage.userToken;
  },
  // lists breweries that match the search term
  generateBrewerySearchUrl(breweryName){
    return 'https://api.untappd.com/v4/search/brewery/?access_token=' + localStorage.userToken + '&q=' + breweryName + '&limit=50';
  },
  normalizeBreweryBeers,
  makeBreweryBeerList(json, id){
    const beers = normalizeBreweryBeers(json);
    // works off a previous list or creates a new one
    return {
      id: id,
      beers: [beers],
      checkCount: 0,
      maxItems: json.response.total_count,
      beerCount: beers.length,
    };
  },
  makeBreweryItems(json){
    // loop over each brewery and create an object for it, then return array of those objects
    let breweries = [];
    json.response.brewery.items.forEach(function(breweryObj){
      // props: name, image, id
      const normalizedBrewery = {
        id: breweryObj.brewery.brewery_id,
        name: breweryObj.brewery.brewery_name,
        image: breweryObj.brewery.brewery_label,
      };
      breweries.push(normalizedBrewery);
    });
    return breweries;
  },
};

export default utils;