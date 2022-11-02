const path = require('path');
const fs = require('fs');

const folderPath = path.join(__dirname, '/secret-folder');

fs.readdir(folderPath, { withFileTypes: true }, (error, files) => {
    if (error) return console.error(error.message);
    files.forEach(file => {
        if (!file.isDirectory()) {
            const filePath = path.join(__dirname, '/secret-folder', file.name);
            const fileName = path.basename(filePath);

            fs.stat(filePath, (err, stats) => {
                if (err) return console.err(err.message);
                const fileSize = Math.fround(stats.size / 1024).toFixed(2);
                console.log(fileName.split(".").join(" - ") + ' -', fileSize + 'kB');
            });
        }
    });
});






