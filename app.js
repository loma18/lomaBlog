/* eslint-disable */
const http = require("http");
const express = require("express");
const path = require('path');

let app = express();
const source = require("./router/source");
app.use(source);

const router = require("./router");
const adminHome = require('./router/admin/home');
const adminPhotos = require('./router/admin/photos');
const home = require('./router/home');
const interfaces = require('./router/admin/interface');
const whisper = require('./router/admin/whispepr');
app.use(router);
app.use(adminHome);
app.use(adminPhotos);
app.use(home);
app.use(interfaces);
app.use(whisper);
app.use('/attachment', express.static(path.join(__dirname, './attachment')));
app.use('/introduce', express.static(path.join(__dirname, './introduce-webPage')));
app.use(express.static(path.join(__dirname, './public/build')));
app.use(/(\/.*)?/, express.static(path.join(__dirname, './public/build')));

//以下代码用以测试auto.js文件自动重启功能
// test();
// function test() {
//     console.log("服务进行中。。。");

//     setTimeout(function () {
//         console('模拟各种异步业务逻辑。。。');
//         let c= a.b;// 这里a undefined.所以会报错
//         //业务正常执行完成，系统退出。
//         process.exit(0);
//     },1000);
// }

let server = http.createServer(app);
server.listen(80);




