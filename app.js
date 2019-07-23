const http = require("http");
const express = require("express");
const path = require('path');
const router = require("./router");
const home = require('./router/admin/home');
const interfaces = require('./router/admin/interface');

let app = express();
app.use(router);
app.use(home);
app.use(interfaces);
app.use(express.static(path.join(__dirname, './public/build')));
app.use(/(\/.*)?/, express.static(path.join(__dirname, './public/build')));

let server = http.createServer(app);
server.listen(8080);




