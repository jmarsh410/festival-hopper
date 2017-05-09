// script that takes an array of beer id's
// makes untappd api calls for each beer id

// then makes a file that contains all the objects received.
const fs = require('fs');
const https = require('https');

const clientId = 'B37286DA6E41C3C75634F4C0DB726E889052525C';
const clientSecret = '8E445ABC27BC99A5D67CBB98AEAA2E936E02AE28';
const fileName = process.argv[2];
const variableName = fileName[0].toUpperCase() + fileName.substring(1);
const writePath = './src/data-lists/' + fileName + '.js';
const array = [
  189422,  //Einhorn,
];

function renderFileContents(data){
  return `
const ${variableName} = [${data}
];
export default ${variableName};`.trim();
}

function writeFile(template){
  fs.writeFile(writePath, template, function(err){
    if (err) {
      console.error(err);
    }
    console.log('file has been created');
  });
}

function getItems(array){
  let beers = [];
  let queue = array.length;
  const done = function(){
    const template = renderFileContents(beers);
    writeFile(template);
  };
  const next = function(){
    --queue;
    if (queue === 0) {
      done();
    }
  };
  array.forEach(function(beerId){
    const apiPath = 'https://api.untappd.com/v4/beer/info/' + beerId + '?client_id=' + clientId + '&client_secret=' + clientSecret;
    // const apiPath = 'https://api.untappd.com/v4/beer/info/' + beerId + '?access_token=B37286DA6E41C3C75634F4C0DB726E889052525C';
    https.get(apiPath, (res)=>{
      // log number of requests left
      console.log('Number of requests left are: ' + res.headers['x-ratelimit-remaining']);
      let data = '';
      res.on('data', (chunk)=>{
        data += chunk;
      });
      res.on('end', ()=>{
        // add in a new line for prettier printing in the file
        const beer = '\n' + JSON.stringify(JSON.parse(data).response.beer);
        beers.push(beer);
        next();
      });
    }).on('error', (err)=>{
      console.error(err);
      next();
    });
  });
}
getItems(array);