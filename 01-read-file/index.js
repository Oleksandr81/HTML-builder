const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'text.txt');
const readFile = fs.createReadStream(file, 'utf-8');

let data = '';

readFile.on('data', chunk => data += chunk);
readFile.on('end', () => console.log(data));
readFile.on('error', error => console.log('Error', error.message));
