// command 'node normalizeDataLists.js {pathToFolder} {fileName}'

const fs = require('fs');
const _ = require('lodash');
// carbon copy of what is used in /src/utils/utils
const utils = require('./utils/utils');
const pathToFolder = process.argv[2];
const fileName = process.argv[3];
if (!(pathToFolder || fileName)) {
  return console.error('the command line arguments were incorrect');
}

const files = fs.readdirSync(pathToFolder);
const filePaths = files.map((string)=>{
  return pathToFolder + '/' + string;
});
const contents = filePaths.map((string)=>{
  return require(string);
});
const items = _.flatten(contents);
const normalizedItems = utils.makeCuratedList(items, fileName);
console.log(normalizedItems.beers);

