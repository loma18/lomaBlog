let express = require("express");
let router = express.Router();
const qs = require("querystring");
const sqlConnect = require('../../sqlConnect');
const request = require('request');

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

            if (obj.id) {
                sql = `DELETE FROM lomaBlog_article_catalogue where aid=?`;
                sqlConnect.query(sql, [obj.id], (err, result, fields) => {
                    if (err) throw err;
                    handleCatalogue(res, sqlConnect, catalogue, obj, resultMsg);
                });
                return;
            } else {
                handleCatalogue(res, sqlConnect, catalogue, obj, resultMsg);
            }

        })
    })
});

function handleCatalogue(res, sqlConnect, catalogue, obj, resultMsg) {
    let hasNew = false,
        params = [],
        params1 = [],
        articleId = obj.id ? obj.id : resultMsg.insertId;
    let sql = `INSERT INTO lomaBlog_catalogue VALUE`;
    let sql1 = `INSERT INTO lomaBlog_article_catalogue VALUE`;
    for (let i = 0; i < catalogue.length; i++) {
        if (catalogue[i].id == undefined) {
            hasNew = true;
            params.push(catalogue[i].name);
            sql += '(null,?),';
        } else {
            params1.push(articleId, catalogue[i].id);
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
                    params1.push(articleId, insertId);
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
}

// /**获取博客列表 */
router.get("/blog/getFilterList", (req, res) => {
    let obj = req.query;
    let sql = "SELECT t1.aid,t1.title,t1.content,t1.tags,t1.status,t1.createAt,t1.updateAt,t1.articleType,t1.views,count(t2.id) as comments" +
        " FROM lomaBlog_article as t1 left join lomaBlog_article_comment as t2 on t1.aid = t2.aid " +
        " WHERE " +
        "status=? AND " +
        (obj.year ? "year(FROM_UNIXTIME(createAt/1000))=? AND " : '') +
        (obj.month ? "month(FROM_UNIXTIME(createAt/1000))=? AND " : '') +
        (obj.articleType && obj.articleType != 'all' ? "articleType=? AND " : '') +
        (obj.searchVal ? "title LIKE '%" + obj.searchVal + "%' AND " : '') +
        "t1.aid IN (SELECT aid FROM lomaBlog_article_catalogue " +
        (obj.catalogueType && obj.catalogueType != 'all' ? "WHERE cid = ?)" : ')') +
        ' group by t1.aid ' + (obj.page ? " limit " + (obj.page - 1) * 20 + ",20" : '');
    let params = [obj.status];
    if (obj.year) {
        params.push(obj.year);
    }
    if (obj.month) {
        params.push(obj.month);
    }
    if (obj.articleType && obj.articleType != 'all') {
        params.push(obj.articleType);
    }
    if (obj.catalogueType && obj.catalogueType != 'all') {
        params.push(obj.catalogueType);
    }
    if (obj.status == 0) {
        sql = "SELECT * FROM lomaBlog_article WHERE status=0 " + (obj.page ? " limit " + (obj.page - 1) * 20 + ",20" : '');
        params = [];
    }
    if (obj.hotArticle) {
        sql = "SELECT * FROM lomaBlog_article WHERE status=1 ORDER BY views LIMIT 5 ";
        params = [];
    }
    sqlConnect.query(sql, params, (err, result, fields) => {
        if (err) throw err;
        res.json({ code: 200, data: result, msg: "success", total: (obj.page - 1) * 20 + result.length });
    })
});

// /**通过id获取博客 */
router.get("/blog/getArticle", (req, res) => {
    let obj = req.query;
    let sql = "SELECT t1.aid,t1.articleType,t1.content,t1.createAt,t1.status,t1.tags,t1.title,t1.updateAt,t1.views,t2.cid " +
        " FROM lomaBlog_article as t1,lomaBlog_article_catalogue as t2 WHERE t1.aid=? AND t1.aid=t2.aid";
    sqlConnect.query(sql, [obj.id], (err, result, fields) => {
        if (err) throw err;
        let resultObj = {};
        for (let i = 0, len1 = result.length; i < len1; i++) {
            if (!resultObj[result[i].aid]) {
                result[i].cid = [result[i].cid];
                resultObj[result[i].aid] = result[i];
            } else {
                resultObj[result[i].aid].cid.push(result[i].cid);
            }
        }
        res.json({ code: 200, data: resultObj[result[0].aid], msg: "success" });
    })
    //获取mac地址,确定访问对象唯一性--此方法不能获取远程访问服务器的客户端mac,获取的其实只是服务器的mac
    require('getmac').getMac(function (err, userAddress) {
        if (err) throw err
        let mac = userAddress + obj.helpMac;
        sql = `SELECT mac FROM lomaBlog_article_mac where mac='${mac}' AND articleId=${obj.id}`;
        sqlConnect.query(sql, [], (err, result, fields) => {
            if (err) throw err;
            if (result.length == 0) {
                sql = "UPDATE lomaBlog_article SET views=views+1 WHERE aid=?";
                sqlConnect.query(sql, [obj.id], (err, result, fields) => {
                    console.log(result);
                })
                sql = "INSERT INTO lomaBlog_article_mac VALUES(null,?,?)";
                sqlConnect.query(sql, [mac, obj.id], (err, result, fields) => {
                    console.log(result);
                })
            }
        })
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