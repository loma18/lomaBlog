let express = require("express");
let router = express.Router();
const qs = require("querystring");
const sqlConnect = require('../../sqlConnect');

/** 获取个人分类列表*/
router.get("/getCatalogueList", (req, res) => {
    let sql = "SELECT*FROM lomaBlog_catalogue";
    sqlConnect.query(sql, [], (err, result, fields) => {
        if (err) throw err;
        let arr = [];
        if (result.length > 0) {
            result.map(item => {
                arr.push({ id: item.cid, name: item.cname });
            })
        }
        res.json({ code: 200, data: arr, msg: "success" });
    })
});

/**保存/修改个人分类 */
router.post("/catalogue/save", (req, res) => {
    req.on("data", (data) => {
        let str = data.toString(),
            obj = JSON.parse(str),
            sql = "",
            params = [];
        if (obj.id) {
            sql = "UPDATE lomaBlog_catalogue SET cname=? WHERE cid=?";
            params = [obj.name, obj.id];
        } else {
            sql = "INSERT INTO lomaBlog_catalogue VALUES(null,?)";
            params = [obj.name];
        }
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

/**删除个人分类 */
router.get("/catalogue/delete", (req, res) => {
    let obj = req.query;
    let sql = "DELETE FROM lomaBlog_catalogue WHERE cid=?",
        params = [obj.id];
    sqlConnect.query(sql, params, (err, result, fields) => {
        if (err) throw err;
        if (result.affectedRows > 0) {
            res.json({ code: 200, msg: "success" });
        }
    })
});

/**保存博客 */
router.post("/blog/save", (req, res) => {
    req.on("data", (data) => {
        let str = data.toString();
        let obj = JSON.parse(str);
        let article = obj.article.join(','),
            catalogue = obj.catalogue,
            sql = `INSERT INTO lomaBlog_article (title,content,tags,status,createAt,updateAt,articleType) VALUES(?,?,?,?,UNIX_TIMESTAMP(NOW())*1000,UNIX_TIMESTAMP(NOW())*1000,?)`,
            params = [obj.title, obj.content, article, obj.status, obj.articleType];
        if (obj.id) {
            sql = `UPDATE lomaBlog_article SET title=?,content=?,tags=?,status=?,updateAt=UNIX_TIMESTAMP(NOW())*1000,articleType=? WHERE aid=?`;
            params = [obj.title, obj.content, article, obj.status, obj.articleType, obj.id];
        }
        sqlConnect.query(sql, params, (err, resultMsg, fields) => {
            if (err) throw err;
            if (catalogue.length === 0) {
                res.json({ code: 200, msg: 'success' });
                return;
            }
            let hasNew = false,
                params = [],
                params1 = [];
            sql = `INSERT INTO lomaBlog_catalogue VALUE`;
            let sql1 = `INSERT INTO lomaBlog_article_catalogue VALUE`;
            for (let i = 0; i < catalogue.length; i++) {
                if (catalogue[i].id == undefined) {
                    hasNew = true;
                    params.push(catalogue[i].name);
                    sql += '(null,?),';
                } else {
                    params1.push(resultMsg.insertId, catalogue[i].id);
                    sql1 += '(null,?,?),';
                }
            }
            sql = sql.replace(/,$/, '');
            if (hasNew) {
                sqlConnect.query(sql, params, (err, result, fields) => {
                    if (err) throw err;
                    if (result.affectedRows > 0) {
                        let insertId = result.insertId;
                        for (let i = 0; i < result.affectedRows; i++) {
                            params1.push(resultMsg.insertId, insertId);
                            sql1 += '(null,?,?),';
                            insertId++;
                        }
                        sql1 = sql1.replace(/,$/, '');
                        sqlConnect.query(sql1, params1, (err, result, fields) => {
                            if (err) throw err;
                            if (result.affectedRows > 0) {
                                res.json({ code: 200, msg: "success" });
                            } else {
                                res.json({ code: 500, msg: "保存失败" });
                            }
                        });
                    } else {
                        res.json({ code: 500, msg: "保存失败" });
                    }
                });
            } else {
                sql1 = sql1.replace(/,$/, '');
                sqlConnect.query(sql1, params1, (err, result, fields) => {
                    if (err) throw err;
                    if (result.affectedRows > 0) {
                        res.json({ code: 200, msg: "success" });
                    } else {
                        res.json({ code: 500, msg: "保存失败" });
                    }
                });
            }
        })
    })
});

// /**获取博客列表 */
router.get("/blog/getFilterList", (req, res) => {
    let obj = req.query;//
    let sql = "SELECT t1.aid,t1.title,t1.content,t1.tags,t1.status,t1.createAt,t1.updateAt,t1.articleType,t1.views,count(t2.id) as comments" +
        " FROM lomaBlog_article as t1 left join lomaBlog_article_comment as t2 on t1.aid = t2.aid " +
        " WHERE " +
        (obj.year ? "year(FROM_UNIXTIME(createAt/1000))=? AND " : '') +
        (obj.month ? "month(FROM_UNIXTIME(createAt/1000))=? AND " : '') +
        (obj.articleType && obj.articleType != 'all' ? "articleType=? AND " : '') +
        (obj.searchVal ? "title LIKE '%" + obj.searchVal + "%' AND " : '') +
        "t1.aid IN (SELECT aid FROM lomaBlog_article_catalogue " +
        (obj.catalogueType && obj.catalogueType != 'all' ? "WHERE cid = ?)" : ')') +
        ' group by t1.aid ' + (obj.page ? " limit " + (obj.page - 1) * 10 + ",20" : '');
    let params = [];
    if (obj.year) {
        params.push(obj.year);
    }
    if (obj.month) {
        params.push(obj.month);
    }
    if (obj.articleType && obj.articleType != 'all') {
        params.push(obj.articleType);
    }
    // if (obj.searchVal) {
    //     params.push(obj.searchVal);
    // }
    if (obj.catalogueType && obj.catalogueType != 'all') {
        params.push(obj.catalogueType);
    }
    // if (obj.page) {
    //     params.push(obj.page);
    // }
    sqlConnect.query(sql, params, (err, result, fields) => {
        if (err) throw err;
        res.json({ code: 200, data: result, msg: "success", total: (obj.page - 1) * 10 + result.length });
    })
});

// /**通过id获取博客 */
router.get("/blog/getArticle", (req, res) => {
    let obj = req.query;
    let sql = "SELECT * FROM lomaBlog_article WHERE aid=?";
    sqlConnect.query(sql, [obj.id], (err, result, fields) => {
        if (err) throw err;
        res.json({ code: 200, data: result[0], msg: "success" });
    })
    sql = "UPDATE lomaBlog_article SET views=views+1 WHERE aid=?"
    sqlConnect.query(sql, [obj.id, obj.id], (err, result, fields) => {
        if (err) throw err;
        if (result.affectedRows > 0) {
            // console.log(result);
        }
    })
});

// /**通过id删除博客 */
router.get("/blog/deleteArticle", (req, res) => {
    let obj = req.query;
    let sql = "DELETE FROM lomaBlog_article WHERE aid=?";
    sqlConnect.query(sql, [obj.id], (err, result, fields) => {
        if (err) throw err;
        if (result.affectedRows > 0) {
            res.json({ code: 200, msg: "success" });
        }
    })
});

module.exports = router;