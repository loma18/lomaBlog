let express = require("express");
let router = express.Router();
const qs = require("querystring");
const sqlConnect = require('../../sqlConnect');


/**查看数 */
router.get("/blog/views", (req, res) => {
    let obj = req.query,
        sql = "UPDATE lomaBlog_article SET views=(SELECT views FROM lomaBlog_article WHERE aid=?)+1 WHERE aid=?",
        params = [obj.id];
    sqlConnect.query(sql, params, (err, result, fields) => {
        if (err) throw err;
        if (result.affectedRows > 0) {
            res.json({ code: 200, msg: "success" });
        }
    })
});

module.exports = router;