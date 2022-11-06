const path = require('path');
const fs = require('fs');
const fsPromises = require('fs/promises');
const { basename } = require('path');

const pathFolder = path.join(__dirname);
const pathFolderProjectDist = path.join(__dirname, 'project-dist');
const pathDistAssetsFolder = path.join(__dirname, 'project-dist', 'assets');
const pathDistStyleFile = path.join(pathFolderProjectDist, 'style.css');
const pathStyleFolder = path.join(__dirname, 'styles');
const pathTemplateHtml = path.join(__dirname, 'template.html');
const pathDistIndexHtml = path.join(pathFolderProjectDist, 'index.html');

createDist();

async function createDist() {
  console.log('\nStart build project:\n');
  
  // remove old folder 'project-dist' 
  await fsPromises.rm(pathFolderProjectDist, { recursive: true, force: true }).then(() => {
    console.log(`==> ${pathFolderProjectDist} removed`);
  });
  // create new folder 'project-dist'
  await fsPromises.mkdir(pathFolderProjectDist).then(() => {
    console.log(`==> ${pathFolderProjectDist} created`);
  });
  // create new folder 'project-dist/assets'
  await fsPromises.mkdir(pathDistAssetsFolder).then(() => {
    console.log(`==> ${pathDistAssetsFolder} created`);
  });
  // build style.css
  buildStyleCss();
  // copy files from 'assets' to 'project-dist/assets'
  readFolder(pathFolder, 'assets');
  // build index.html
  buildIndexHtml();
}

function buildStyleCss() {
  fs.writeFile(pathDistStyleFile, '', (error) => {
    if (error) return console.error(error.message);
    console.log('created file style.css\n');
  });

  fs.readdir(pathStyleFolder, { withFileTypes: true }, (error, files) => {
    if (error) return console.error(error.message);

    files.forEach(file => {
      if (path.extname(file.name) === '.css') {
        const cssFile = path.join(pathStyleFolder, file.name);
        fs.readFile(cssFile, 'utf-8', (error, data) => {
          if (error) return console.error(error.message);

          fs.appendFile(pathDistStyleFile, data, (error) => {
            if (error) return console.error(error.message);
            console.log(`${file.name} add to "style.css"`);
          });
        });
      }
    });
  });
}

function readFolder(pathFolder, folderName) {
  const newPath = path.join(pathFolder, folderName);
  const newPathProjectDist = path.join(__dirname, 'project-dist', folderName);

  fs.readdir(newPath, { withFileTypes: true }, (error, files) => {
    if (error) return console.error(error.message);
    files.forEach(file => {
      if (file.isDirectory()) {
        const newFolderName = path.join(folderName, file.name);

        mkdirFolder(newPathProjectDist, file.name);
        readFolder(pathFolder, newFolderName);
      } else {
        const copyFileFrom = path.join(newPath, file.name);
        const copyFileTo = path.join(newPathProjectDist, file.name);

        copyFiles(copyFileFrom, copyFileTo);
      }
    });
  });
}

function copyFiles(copyFileFrom, copyFileTo) {
  const input = fs.createReadStream(copyFileFrom);
  const output = fs.createWriteStream(copyFileTo);

  input.pipe(output);
}

function mkdirFolder(pathFolder, folderName) {
  const createFolder = path.join(pathFolder, folderName);
  fs.mkdir(createFolder, (error) => {
    if (error) return console.error(error.message);
  });
}

function buildIndexHtml() {
  const componts = [];
  const pathComponents = path.join(__dirname, 'components');
  const input = fs.createReadStream(pathTemplateHtml, 'utf-8');
  
  let str = '';

  input.on('data', async data => {
    str = data.toString();

    let files = await fsPromises.readdir(pathComponents, { withFileTypes: true });
    
    for(let file of files) {
      if (!file.isDirectory()) {
        componts.push(path.basename(file.name).slice(0, -5));
      }
    }
    
    for (let comp of componts) {      
      if (str.includes("{{" + comp + "}}")) {
        const fileComponent = path.join(pathComponents, comp + ".html");
        let content = await fsPromises.readFile(fileComponent, 'utf-8');
        
        str = str.replace("{{" + comp + "}}", content);
        await fsPromises.writeFile(pathDistIndexHtml, str);
        console.log(`${comp} add to index.html`);
      }
    }
    console.log(`==> create ${pathDistIndexHtml} is complete\n`);
  });
}