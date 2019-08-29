let express = require("express");
const axios = require('axios');
let router = express.Router();
const qs = require("querystring");
const sqlConnect = require('../../sqlConnect');


/**新增评论 */
router.post("/blog/createArticleComment", (req, res) => {
    req.on("data", (data) => {
        let str = data.toString(),
            obj = JSON.parse(str),
            sql = "",
            params = [],
            username = '';
        require('getmac').getMac(function (err, userAddress) {
            if (err) throw err
            sql = `SELECT * FROM lomaBlog_user_mac WHERE mac='${userAddress}'`;
            sqlConnect.query(sql, params, (err, result, fields) => {
                if (err) throw err;
                if (result.length === 0) {
                    sql = `INSERT INTO lomaBlog_user_mac VALUES(null,?,?)`
                    username = obj.username ? obj.username : '游客' + Math.floor((Math.random() * 100000000));
                    params = [userAddress, username];
                    sqlConnect.query(sql, params, (err, result, fields) => {
                        if (err) throw err;
                        if (result.affectedRows > 0) {
                            console.log('新增mac-username成功');
                        }
                    })
                } else {
                    username = result[0].username;
                }
                sql = "INSERT INTO lomaBlog_article_comment VALUE(null,?,?,?,?,?,UNIX_TIMESTAMP(NOW())*1000,?,?)";
                params = [obj.articalId, username, obj.qq, obj.email, obj.content, obj.parentId, obj.parentUsername];
                sqlConnect.query(sql, params, (err, result, fields) => {
                    if (err) throw err;
                    if (result.affectedRows > 0) {
                        res.json({ code: 200, msg: "success" });
                    }
                })
            })
        });
    })
});

//获取博客评论列表
router.get("/blog/getArticleComment", (req, res) => {
    let obj = req.query,
        sql = "SELECT * FROM lomaBlog_article_comment WHERE aid=?",
        params = [obj.articalId],
        arr = [];
    sqlConnect.query(sql, params, (err, result, fields) => {
        if (err) throw err;
        for (let i = 0; i < result.length; i++) {
            if (result[i].parentId) {
                for (let j = 0; j < arr.length; j++) {
                    if (result[i].parentId == arr[j].id) {
                        arr.splice(j + 1, 0, result[i]);
                        break;
                    }
                }
            } else {
                arr.push(result[i]);
            }
        }
        res.json({ code: 200, msg: "success", data: arr });
    })
});

//获取博客文章各自条数
router.get("/blog/getArticleTypeCount", (req, res) => {
    let obj = req.query,
        sql = "SELECT count(*) as total,articleType FROM lomaBlog_article WHERE status=1 group by articleType";
    sqlConnect.query(sql, [], (err, result, fields) => {
        if (err) throw err;
        res.json({ code: 200, msg: "success", data: result });
    })
});

module.exports = router;