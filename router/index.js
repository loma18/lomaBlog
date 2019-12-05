/* eslint-disable */
let express = require("express");
let router = express.Router();
const qs = require("querystring");
const sqlConnect = require('../sqlConnect');
const path = require('path');
const sendEmail = require('./sendEmail.js');
const request = require('request');
let fs = require('fs-extra');

router.get('/baidu_verify_fdB5I1FLUq.html', (req, res) => {
    res.sendFile(path.join(__dirname, '/../baidu_verify_fdB5I1FLUq.html'));
})

router.get('/sitemap_loma18.txt', (req, res) => {
    res.sendFile(path.join(__dirname, '/../sitemap_loma18.txt'));
})

/*用户登录*/
router.post("/login", (req, res) => {
    req.on("data", (data) => {
        let str = data.toString(),
            obj = JSON.parse(str),
            sql = "SELECT*FROM lomaBlog_user WHERE uname=? AND upwd=?",
            params = [obj.uname, obj.upwd];
        sqlConnect.query(sql, params, (err, result, fields) => {
            if (err) {
                res.json({ code: 500, msg: err });
                return;
            };
            if (result.length > 0) {
                res.json({ code: 200, msg: "登陆成功" });
                // conn.release();
            } else {
                res.json({ code: -1, msg: "用户名或密码错误" });
                // conn.release();
            }
        });
    })
});

/*获取用户登陆信息*/
router.get('/getClientInfo', (req, res) => {
    let ip = req.ip.split(':');
    ip = ip[ip.length - 1];
    let url = `https://sp0.baidu.com/8aQDcjqpAAV3otqbppnN2DJv/api.php?query=${ip}&resource_id=6006&oe=utf8&ie=utf8`;
    request(url, (err, req, res) => {
        if (err) {
            res.end();
        }
        let data = JSON.parse(res).data,
            date = new Date();
        let msg = `ip:${data[0] && data[0].OriginQuery}所在地址为${data[0] && data[0].location},于${date.toLocaleDateString() + ' ' + date.toLocaleTimeString()}访问了您的网址\n`;
        fs.appendFileSync('./ipLog.txt', msg);
        console.log('msg', msg);
    });
})

router.post('/sendMsg', (req, res) => {
    req.on("data", (data) => {
        let str = data.toString(),
            obj = JSON.parse(str);
        sendEmail.send(obj, res);
    })
})


module.exports = router;