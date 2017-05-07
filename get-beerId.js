// script that takes an array of beer id's
// makes untappd api calls for each beer id

// then makes a file that contains all the objects received.
const fs = require('fs');
const https = require('https');

const clientId = 'B37286DA6E41C3C75634F4C0DB726E889052525C';
const clientSecret = '8E445ABC27BC99A5D67CBB98AEAA2E936E02AE28';
const fileName = process.argv[2];
const writePath = './beerIds/' + fileName + '.js';
const array = [
  'ACTION! ALE',
  'Black Thunder',
  'Bloodwork Orange',
  'Fire Eagle',
  'Peacemaker',
  'Pearl-Snap',
  'Heisenberg',
  'Sputnik',
  'El Sputniko',
  'Choco Leche',
  'Frankie',
  'French Bully',
  'Heavy Machinery',
  'Midnight Swordfight',
  'Templar Nights',
  'Finkle (H)',
  'Finkle (P)',
  'Finkle (A)',
  'Finkle (R)',
  'Finkle (SP)'
];

function renderFileContents(data){
  return `
[${data}
]`.trim();
}

function writeFile(template){
  fs.writeFile(writePath, template, function(err){
    if (err) {
      console.error(err);
    }
    console.log('file has been created');
  });
}

function getBeerIds(array){
  let beerIds = [];
  let queue = array.length;
  const done = function(){
    const template = renderFileContents(beerIds);
    writeFile(template);
  };
  const next = function(){
    --queue;
    if (queue === 0) {
      done();
    }
  };
  array.forEach(function(beerName){
    const apiPath = 'https://api.untappd.com/v4/search/beer?client_id=' + clientId + '&client_secret=' + clientSecret + '&q=' + beerName;
    https.get(apiPath, (res)=>{
      // log number of requests left
      let data = '';
      res.on('data', (chunk)=>{
        data += chunk;
      });
      res.on('end', ()=>{
        console.log('Number of requests left are: ' + res.headers['x-ratelimit-remaining']);
        // handle errors
        if (res.statusCode !== 200) {
          const meta = JSON.parse(data).meta;
          const errorMessage = meta.developer_friendly ? meta.developer_friendly : meta.error_detail;
          console.log('error getting' + beerName + '. status code ' + res.statusCode);
          console.log(errorMessage);
          return;
        }
        // add in a new line for prettier printing in the file
        const beerId = '\n' + JSON.parse(data).response.beers.items[0].beer.bid + ',  //' + beerName;
        beerIds.push(beerId);
        next();
      });
    }).on('error', (err)=>{
      console.error(err);
      next();
    });
  });
}
getBeerIds(array);