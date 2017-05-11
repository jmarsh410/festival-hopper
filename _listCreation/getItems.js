// command 'node getItems.js {pathToArrayFile} {folderDestination}'

// script that takes an array of beer id's
// makes untappd api calls for each beer id

// then makes a file that contains all the objects received.
const fs = require('fs');
const https = require('https');

const clientId = 'B37286DA6E41C3C75634F4C0DB726E889052525C';
const clientSecret = '8E445ABC27BC99A5D67CBB98AEAA2E936E02AE28';
const array = require(process.argv[2]);
const folderName = process.argv[3];

const folderExists = fs.readdirSync('./data-lists/').includes(folderName); // ex) data-lists/purge
const folderPath = './data-lists/' + folderName;
// create the folder if it doesn't exist
if (!folderExists) {
  fs.mkdirSync(folderPath);
}
// create a number based file name
const fileName = fs.readdirSync(folderPath).length + '.js';
const filePath = folderPath + '/' + fileName;

// legacy, use for the normalized data set
// function renderFileContents(data){
//   return `
// const ${fileName} = [${data}
// ];
// export default ${fileName};`.trim();
// }

function renderFileContents(data){
  return `
module.exports = [${data}
];`.trim();
}

function writeFile(template){
  fs.writeFile(filePath, template, function(err){
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
    https.get(apiPath, (res)=>{
      let data = '';
      res.on('data', (chunk)=>{
        data += chunk;
      });
      res.on('end', ()=>{
        // log number of requests left
        console.log('Number of requests left are: ' + res.headers['x-ratelimit-remaining']);
        // handle errors
        if (res.statusCode !== 200) {
          const meta = JSON.parse(data).meta;
          const errorMessage = meta.developer_friendly ? meta.developer_friendly : meta.error_detail;
          console.log('error getting' + beerId + '. status code ' + res.statusCode);
          console.log(errorMessage);
          return;
        }
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
