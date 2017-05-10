module.exports = {
  makeCuratedList: function(array, id){
    let beers = [];
    array.forEach(function(beer, i){
      const normalizedBeer = {
        id: beer.bid,
        name: beer.beer_name,
        brewery: beer.brewery.brewery_name,
        image: beer.beer_label,
        rating: 3,
        isCheckedIn: false,
        isOpen: false,
        checked: false,
        bucket: 0, // curated lists have only 1 bucket and will always have a bucket value of 0
        index: i,
      };
      beers.push(normalizedBeer);
    });
    return {
      id: id,
      beers: [beers],
      checkCount: 0,
    };
  },
};