let express = require("express");
let router = express.Router();
const qs = require("querystring");
const sqlConnect = require('../../sqlConnect');


/**新增微语 */
router.post("/whisper/save", (req, res) => {
    req.on("data", (data) => {
        let str = data.toString(),
            obj = JSON.parse(str),
            sql = "",
            params = [];
        sql = "INSERT INTO lomaBlog_whisper VALUES(null,?,UNIX_TIMESTAMP(NOW())*1000,0)";
        params = [obj.description];
        sqlConnect.query(sql, params, (err, result, fields) => {
            if (err) throw err;
            if (result.affectedRows > 0) {
                res.json({ code: 200, msg: "success" });
            } else {
                res.json({ code: 500, msg: "error" });
            }
        });
    })
});


/** 删除微语*/
router.get("/whisper/delete", (req, res) => {
    let obj = req.query,
        sql = "UPDATE lomaBlog_whisper SET status=-1 WHERE id=?",
        params = [obj.id];
    sqlConnect.query(sql, params, (err, result, fields) => {
        if (err) throw err;
        if (result.affectedRows > 0) {
            res.json({ code: 200, msg: "success" });
        } else {
            res.json({ code: 500, msg: "error" });
        }
    })
});


/** 获取微语列表*/
router.get("/whisper/getList", (req, res) => {
    let obj = req.query,
        sql1 = "SELECT * FROM lomaBlog_whisper WHERE status=0 " + (obj.searchValue ? " AND description LIKE '%" + obj.searchValue + "%' " : ' ') +
            "order by createAt desc limit " + (obj.page - 1) * 20 + ",20",
        sql2 = "SELECT count(id) as total FROM lomaBlog_whisper WHERE status=0 " + (obj.searchValue ? " AND description LIKE '%" + obj.searchValue + "%' " : ' '),
        params = [];
    sqlConnect.query(sql1, params, (err, result1, fields) => {
        if (err) throw err;
        sqlConnect.query(sql2, params, (err, result2, fields) => {
            if (err) throw err;
            res.json({ code: 200, data: result1, msg: "success", total: result2[0].total });
        })
    })

});

module.exports = router;