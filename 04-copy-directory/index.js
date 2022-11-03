const fs = require('fs');
const path = require('path');

const pathFolder = path.join(__dirname, 'files-copy');
const copyFolger = path.join(__dirname, 'files');

fs.readdir(pathFolder, (error, files) => {
    if (error) return console.error(error.message);
    files.forEach(file => {
        const destFile = path.join(__dirname, 'files-copy', file); 
        
        fs.unlink(destFile, (error) => {
            if (error) return console.error(error.message);
        });
    });
});

fs.mkdir(pathFolder, {recursive: true}, () => {
    console.log('folder is create');
    
    fs.readdir(copyFolger, (error, files) => {
        if (error) return console.error(error.message);
        
        files.forEach(file => {
            const srcFile = path.join(__dirname, 'files', file);
            const destFile = path.join(__dirname, 'files-copy', file);

            fs.copyFile(srcFile, destFile, (error) => {
                if (error) return console.error(error.message);
                console.log(`file "${file}" is copied`);
            });
        });
    });
});
