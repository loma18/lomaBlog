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
            sql = "INSERT INTO lomaBlog_article_comment VALUE(null,?,?,?,?,?,UNIX_TIMESTAMP(NOW())*1000,?,?)",
            params = [obj.articalId, obj.username, obj.qq, obj.email, obj.content, obj.parentId, obj.parentUsername];
        sqlConnect.query(sql, params, (err, result, fields) => {
            if (err) throw err;
            if (result.affectedRows > 0) {
                res.json({ code: 200, msg: "success" });
            }
        })
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
        if (result.length > 0) {
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
        }
    })
});

//获取博客文章各自条数
router.get("/blog/getArticleTypeCount", (req, res) => {
    let obj = req.query,
        sql = "SELECT count(*) as total,articleType FROM lomaBlog_article group by articleType";
    sqlConnect.query(sql, [], (err, result, fields) => {
        if (err) throw err;
        res.json({ code: 200, msg: "success", data: result });
    })
});

//获取酷狗歌曲
router.get("/kugou/getSongs", (req, res) => {
    let obj = req.query;
    axios.get('http://m.kugou.com/?json=true').then(response => {
        res.json(response.data);
    })
});

module.exports = router;