let express = require("express");
let router = express.Router();
const qs = require("querystring");
const sqlConnect = require('../sqlConnect');


/*用户登录*/
router.post("/login", (req, res) => {
    req.on("data", (data) => {
        let str = data.toString(),
            obj = JSON.parse(str),
            sql = "SELECT*FROM lomaBlog_user WHERE uname=? AND upwd=?",
            params = [obj.uname, obj.upwd];
        sqlConnect.query(sql, params, (err, result, fields) => {
            if (err) throw err;
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


module.exports = router;