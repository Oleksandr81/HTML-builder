const fs = require('fs');
const path = require('path');
const { stdin, stdout } = process;
const file = path.join(__dirname, 'text.txt');
const output = fs.createWriteStream(file);

stdout.write('Please, input the text:\n\n');
stdin.on('data', chunk => {
    const chunkExit = chunk.toString().slice(0, -2);
    if (chunkExit === 'exit') {
        process.exit();
    } else {
        output.write(chunk);
    }

});
process.on('SIGINT', () => {
    process.exit();
});

process.on('exit', () => stdout.write('\nInput the text is end. Buy!'));
