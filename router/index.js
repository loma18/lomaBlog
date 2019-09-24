let express = require("express");
let router = express.Router();
const qs = require("querystring");
const sqlConnect = require('../sqlConnect');
const path = require('path');
const sendEmail = require('./sendEmail.js');

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

router.post('/sendMsg', (req, res) => {
    req.on("data", (data) => {
        let str = data.toString(),
            obj = JSON.parse(str);
        sendEmail.send(obj,res);
    })
})


module.exports = router;