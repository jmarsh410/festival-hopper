// command 'node getItems.js {pathToArrayFile} {folderDestination}'

// script that takes an array of beer id's
// makes untappd api calls for each beer id

// then makes a file that contains all the objects received.
const fs = require('fs');
const https = require('https');

const clientId = 'B37286DA6E41C3C75634F4C0DB726E889052525C';
const clientSecret = '8E445ABC27BC99A5D67CBB98AEAA2E936E02AE28';
const nameArray = require(process.argv[2]);
const folderName = process.argv[3];

const folderExists = fs.readdirSync('./beerIdLists/').includes(folderName); // ex) data-lists/purge
const folderPath = './beerIdLists/' + folderName;
// create the folder if it doesn't exist
if (!folderExists) {
  fs.mkdirSync(folderPath);
}
// create a number based file name
const fileName = fs.readdirSync(folderPath).length + '.js';
const filePath = folderPath + '/' + fileName;

function renderFileContents(data){
  return `
module.exports = [${data}
]`.trim();
}

function writeFile(template){
  fs.writeFile(filePath, template, function(err){
    if (err) {
      console.error(err);
    }
    console.log('file has been created');
  });
}

function getBeerIds(array){
  if (fileName.length === 0) {
    return console.error('no file name was specified');
  }
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
        const beersObj = JSON.parse(data).response.beers;
        let bidNum = '';
        let apiName = '';
        // no beers were returned
        if (beersObj.count === 0) {
          console.error('error getting ' + beerName + '. status code ' + res.statusCode);
          bidNum = 'ERROR';
        } else {
          bidNum = beersObj.items[0].beer.bid;
          apiName = beersObj.items[0].beer.beer_name;
        }
        // add in a new line for prettier printing in the file
        const beerId = '\n' + bidNum + ',  //' + beerName + '. api returned ' + apiName;
        beerIds.push(beerId);
        next();
      });
    }).on('error', (err)=>{
      console.error(err);
      next();
    });
  });
}
getBeerIds(nameArray);