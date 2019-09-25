let process = require('child_process');
let fs = require('fs-extra');
const path = require('path');
let ChildProcess = process.fork(path.join(__dirname, '../app.js'));

ChildProcess.on('exit', function (code) {
    console.log('process exits + ' + code);
    fs.appendFileSync('./log.txt', '线程退出' + code);
    if (code !== 0) {
        process.fork(path.join(__dirname, './auto.js'));
    }

});