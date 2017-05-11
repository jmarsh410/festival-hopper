// command 'node normalizeDataLists.js {pathToFolderThatContainsLists} {fileName}'

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
// TODO: double check that the deDuping worked
const items = _.uniqBy(_.flatten(contents), 'bid');
const normalizedItems = JSON.stringify(utils.makeCuratedList(items, fileName));
const data = `const ${fileName} = ${normalizedItems};
export default ${fileName};`.trim();
fs.writeFileSync('./normalizedLists/' + fileName + '.js', data);
