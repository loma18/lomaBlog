const http = require("http");
const express = require("express");
const path = require('path');
const request = require('request');

let app = express();

// let serverUrl = 'http://m.kugou.com';

// app.use('/kugou', function (req, res) {
//     let url = serverUrl + req.url.replace(/\/kugou/, '');
//     req.pipe(request(url)).pipe(res);
// });
app.use('/source', function (req, res) {
    let url = req.url.replace(/^\/source/, '').replace(/^\//, '');
    req.pipe(request(url)).pipe(res);
});

// app.use(function (req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Methods", "*");
//     res.header("Access-Control-Allow-Credentials", "true");
//     res.header("Access-Control-Allow-Headers", "Content-Type");
//     res.header("Access-Control-Expose-Headers", "*");
//     //如果需要使用put和delete需要对OPTION返回响应
//     if (req.method == 'OPTIONS') {
//         res.send('');
//         return;
//     }
//     next();
// })
const router = require("./router");
const adminHome = require('./router/admin/home');
const home = require('./router/home');
const interfaces = require('./router/admin/interface');
app.use(router);
app.use(adminHome);
app.use(home);
app.use(interfaces);
app.use(express.static(path.join(__dirname, './public/build')));
app.use(/(\/.*)?/, express.static(path.join(__dirname, './public/build')));

let server = http.createServer(app);
server.listen(8080);




