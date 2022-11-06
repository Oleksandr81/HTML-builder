const path = require('path');
const fs = require('fs');

const pathStyleFolder = path.join(__dirname, 'styles');
const pathStyleFile = path.join(__dirname, 'project-dist', 'bundle.css');

fs.writeFile(pathStyleFile, '', (error) => {
  if (error) return console.error(error.message);
  console.log('the file "bundle.css" has been created');
});

fs.readdir(pathStyleFolder, { withFileTypes: true }, (error, files) => {
  if (error) return console.error(error.message);

  files.forEach(file => {
    if (!file.isDirectory()) {
      if (path.extname(file.name) === '.css') {
        const cssFile = path.join(__dirname, 'styles', file.name);

        fs.readFile(cssFile, 'utf-8', (error, data) => {
          if (error) return console.error(error.message);

          fs.appendFile(pathStyleFile, data, (error) => {
            if (error) return console.error(error.message);
            console.log(`${file.name} add to "bundle.css"`);
          });
        });
      }
    }
  });
});
