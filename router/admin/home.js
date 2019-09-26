/* eslint-disable */
let express = require("express");
let router = express.Router();
const qs = require("querystring");
const sqlConnect = require('../../sqlConnect');
const request = require('request');
var fs = require('fs');
var formidable = require('formidable');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var utils = require('../../utils');
let app = express();
app.use(multipart({ uploadDir: '/attachment' }))

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
            if (err) {
                res.json({ code: 500, msg: err });
                return;
            };
            if (result.affectedRows > 0) {
                res.json({ code: 200, msg: "success" });
                return;
            } else {
                res.json({ code: 500, msg: "error" });
                return;
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
        if (err) {
            res.json({ code: 500, msg: err });
            return;
        };
        if (result.affectedRows > 0) {
            res.json({ code: 200, msg: "success" });
        }
    })
});

/**
 * 获取附件列表
 */
router.get("/blog/attachment/getList", (req, res) => {
    let obj = req.query;
    let sql = "SELECT id,file_name as fileName FROM lomaBlog_attachment WHERE aid=?",
        params = [obj.articleId];
    sqlConnect.query(sql, params, (err, result, fields) => {
        if (err) {
            res.json({ code: 500, msg: err });
            return;
        };
        res.json({ code: 200, data: result, msg: "success" });
    })
})

/**
 * 下载附件
 */
router.get("/blog/attachment/download", (req, res) => {
    let obj = req.query;
    let sql = "SELECT file_path,file_name FROM lomaBlog_attachment WHERE id=?",
        params = [obj.id];
    sqlConnect.query(sql, params, (err, result, fields) => {
        if (err) {
            res.json({ code: 500, msg: err });
            return;
        };
        if (result.length > 0) {
            var a = result[0].file_path;
            a = a.split(/(?=[a-zA-Z0-9]*?)\.(?=[a-zA-Z0-9]+$)/);
            var mimeType = utils.getMIME(a[1]);
            res.writeHead(200, {
                // 注意这里的type设置，导出不同文件type值不同application/vnd.openxmlformats-officedocument.wordprocessingml.document
                // "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                "Content-Type": `${mimeType};chartset=utf-8`,
                'Content-disposition': `attachment; filename=${encodeURI(result[0].file_name)}`
            });
            let pathname = result[0].file_path;
            let fReadStream = fs.createReadStream(pathname);

            //读取文件发生错误事件
            fReadStream.on('error', (err) => {
                console.log('发生异常:', err);
            });
            //已打开要读取的文件事件
            fReadStream.on('open', (fd) => {
                console.log('文件已打开:', fd);
            });
            //文件已经就位，可用于读取事件
            fReadStream.on('ready', () => {
                console.log('文件已准备好..');
            })
            fReadStream.on('data', (chunk) => {
                res.write(chunk, 'binary');
            });
            //文件读取完成事件
            fReadStream.on('end', () => {
                res.end();
            });
        }
    })
})

/**保存博客 */
router.post("/blog/save", multipartMiddleware, (req, res) => {
    let obj = req.body;
    let article = JSON.parse(obj.article).join(','),
        catalogue = JSON.parse(obj.catalogue),
        sql = `INSERT INTO lomaBlog_article (title,content,tags,status,createAt,updateAt,articleType,description) VALUES(?,?,?,?,UNIX_TIMESTAMP(NOW())*1000,UNIX_TIMESTAMP(NOW())*1000,?,?)`,
        params = [obj.title, obj.content, article, obj.status, obj.articleType, obj.description];
    if (obj.id && obj.id != 'undefined') {
        sql = `UPDATE lomaBlog_article SET title=?,content=?,tags=?,status=?,updateAt=UNIX_TIMESTAMP(NOW())*1000,articleType=?,description=? WHERE aid=?`;
        params = [obj.title, obj.content, article, obj.status, obj.articleType, obj.description, obj.id];
    }
    sqlConnect.query(sql, params, (err, resultMsg, fields) => {
        if (err) {
            res.json({ code: 500, msg: err });
            return;
        }
        if (catalogue.length === 0) {
            deleteAttachment(req, res, sqlConnect, obj, resultMsg);
            return;
        }

        if (obj.id && obj.id != 'undefined') {
            sql = `DELETE FROM lomaBlog_article_catalogue where aid=?`;
            sqlConnect.query(sql, [obj.id], (err, result, fields) => {
                if (err) {
                    res.json({ code: 500, msg: err });
                    return;
                }
                handleCatalogue(req, res, sqlConnect, catalogue, obj, resultMsg);
            });
        } else {
            handleCatalogue(req, res, sqlConnect, catalogue, obj, resultMsg);
        }
    })
});

function saveAttachment(req, res, sqlConnect, obj, resultMsg) {
    let sql = 'INSERT INTO lomaBlog_attachment VALUES(null,?,?,UNIX_TIMESTAMP(NOW())*1000,?)',
        params = [],
        articleId = obj.id && obj.id != 'undefined' ? obj.id : resultMsg.insertId;
    if (!req.files || !req.files.file) {
        res.json({ code: 200, msg: 'success' })
        return;
    }
    let file = req.files.file,
        fileList = file.path ? [file] : file,
        data = '';
    let uploadDir = ''; // 存储路径
    for (let i = 0; i < fileList.length; i++) {
        data = fs.readFileSync(fileList[i].path);
        uploadDir = __dirname + '/../../attachment/';
        fs.writeFile(uploadDir + fileList[i].path.split(['\\']).slice(-1)[0], data, function (err) { // 存储文件
            if (err) {
                res.json({ code: 500, msg: err });
                return;
            }
            fs.unlink(fileList[i].path, function () { }) // 删除文件
            params = [articleId, fileList[i].name, uploadDir + fileList[i].path.split(['\\']).slice(-1)[0]];
            sqlConnect.query(sql, params, (err, result, fields) => {
                if (err) {
                    res.json({ code: 500, msg: err });
                    return;
                }
                if (i == fileList.length - 1) {
                    res.json({ code: 200, msg: 'success' })
                }
            });
        })
    }
}

//删除博客原来相关附件
function deleteAttachment(req, res, sqlConnect, obj, resultMsg) {
    let sql = 'SELECT id,file_path FROM lomaBlog_attachment WHERE aid=?',
        existFileId = JSON.parse(obj.attachmentIds),
        delId = [],
        tempStr = '',
        articleId = obj.id && obj.id != 'undefined' ? obj.id : resultMsg.insertId;
    sqlConnect.query(sql, [articleId], (err, result, fields) => {
        if (err) {
            res.json({ code: 500, msg: err });
            return;
        }
        for (let i = 0; i < result.length; i++) {
            if (existFileId.indexOf(result[i].id) < 0) {
                delId.push(result[i]);
            }
        }
        if (delId.length === 0) {
            saveAttachment(req, res, sqlConnect, obj, resultMsg);
            return;
        }
        tempStr = delId.map(function (item) { return item.id }).join(',');
        sql = `DELETE FROM lomaBlog_attachment WHERE id in (${tempStr})`;
        for (let j = 0; j < delId.length; j++) {
            fs.unlink(delId[j].file_path, function () {
                if (j == delId.length - 1) {
                    sqlConnect.query(sql, [], (err, result, fields) => {
                        if (err) {
                            res.json({ code: 500, msg: err });
                            return;
                        }
                        saveAttachment(req, res, sqlConnect, obj, resultMsg);
                    })
                }
            });
        }
    })
}

function handleCatalogue(req, res, sqlConnect, catalogue, obj, resultMsg) {
    let hasNew = false,
        params = [],
        params1 = [],
        articleId = obj.id && obj.id != 'undefined' ? obj.id : resultMsg.insertId;
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
            if (err) {
                res.json({ code: 500, msg: err });
                return;
            };
            if (result.affectedRows > 0) {
                let insertId = result.insertId;
                for (let i = 0; i < result.affectedRows; i++) {
                    params1.push(articleId, insertId);
                    sql1 += '(null,?,?),';
                    insertId++;
                }
                sql1 = sql1.replace(/,$/, '');
                sqlConnect.query(sql1, params1, (err, result, fields) => {
                    if (err) {
                        res.json({ code: 500, msg: err });
                        return;
                    };
                    if (result.affectedRows > 0) {
                        deleteAttachment(req, res, sqlConnect, obj, resultMsg);
                        // saveAttachment(req, res, sqlConnect, obj, resultMsg);
                        // res.json({ code: 200, msg: "success" });
                    } else {
                        res.json({ code: 500, msg: "保存失败" });
                        return;
                    }
                });
            } else {
                res.json({ code: 500, msg: "保存失败" });
                return;
            }
        });
    } else {
        sql1 = sql1.replace(/,$/, '');
        sqlConnect.query(sql1, params1, (err, result, fields) => {
            if (err) {
                res.json({ code: 500, msg: err });
                return;
            };
            if (result.affectedRows > 0) {
                deleteAttachment(req, res, sqlConnect, obj, resultMsg);
                // saveAttachment(req, res, sqlConnect, obj, resultMsg);
                // res.json({ code: 200, msg: "success" });
            } else {
                res.json({ code: 500, msg: "保存失败" });
                return;
            }
        });
    }
}

// /**获取博客列表 */
router.get("/blog/getFilterList", (req, res) => {
    let obj = req.query;
    let sql = "SELECT t1.aid,t1.title,t1.tags,t1.status,t1.createAt,t1.updateAt,t1.articleType,t1.description,t1.views,count(t2.id) as comments" +
        " FROM lomaBlog_article as t1 left join lomaBlog_article_comment as t2 on t1.aid = t2.aid " +
        " WHERE " +
        "t1.status=? AND " +
        (!obj.showSecret ? "t1.articleType!='secret' AND " : ' ') +
        (obj.year ? "year(FROM_UNIXTIME(createAt/1000))=? AND " : '') +
        (obj.month ? "month(FROM_UNIXTIME(createAt/1000))=? AND " : '') +
        (obj.articleType && obj.articleType != 'all' ? "articleType=? AND " : '') +
        (obj.searchVal ? "title LIKE '%" + obj.searchVal + "%' AND " : '') +
        "t1.aid IN (SELECT aid FROM lomaBlog_article_catalogue " +
        (obj.catalogueType && obj.catalogueType != 'all' ? "WHERE cid = ?)" : ')') +
        ' group by t1.aid ' + (obj.page ? " order by t1.updateAt desc limit " + (obj.page - 1) * 20 + ",20" : '');
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
        sql = "SELECT * FROM lomaBlog_article WHERE status=0 " + (obj.page ? "order by updateAt desc limit " + (obj.page - 1) * 20 + ",20" : '');
        params = [];
    }
    if (obj.hotArticle) {
        sql = "SELECT * FROM lomaBlog_article WHERE status=1 AND articleType!='secret' ORDER BY views desc LIMIT 5 ";
        params = [];
    }
    sqlConnect.query(sql, params, (err, result, fields) => {
        if (err) {
            res.json({ code: 500, msg: err });
            return;
        };
        res.json({ code: 200, data: result, msg: "success", total: (obj.page - 1) * 20 + result.length });
    })
});

// /**通过id获取博客 */
router.get("/blog/getArticle", (req, res) => {
    let obj = req.query;
    let sql = "SELECT t1.aid,t1.articleType,t1.content,t1.createAt,t1.status,t1.tags,t1.title,t1.updateAt,t1.views,t2.cid " +
        " FROM lomaBlog_article as t1,lomaBlog_article_catalogue as t2 WHERE t1.aid=? AND t1.aid=t2.aid" +
        (!obj.showAll ? " AND t1.articleType=? AND t1.status=? AND t1.status!=0 AND t1.articleType!='secret'" : " ");
    sqlConnect.query(sql, [obj.id, obj.articleType, obj.status], (err, result, fields) => {
        if (err) {
            res.json({ code: 500, msg: err });
            return;
        };
        let resultObj = {};
        if (result.length === 0) {
            res.json({ code: 500, data: {}, msg: "没有权限,获取文章失败" });
            return;
        }
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
        if (err) {
            res.json({ code: 500, msg: err });
            return;
        };
        let mac = userAddress + obj.helpMac;
        sql = `SELECT mac FROM lomaBlog_article_mac where mac='${mac}' AND articleId=${obj.id}`;
        sqlConnect.query(sql, [], (err, result, fields) => {
            if (err) {
                res.json({ code: 500, msg: err });
                return;
            };
            if (result.length == 0) {
                sql = "UPDATE lomaBlog_article SET views=views+1 WHERE aid=?";
                sqlConnect.query(sql, [obj.id], (err, result, fields) => {
                    // console.log(result);
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
        if (err) {
            res.json({ code: 500, msg: err });
            return;
        };
        if (result.affectedRows > 0) {
            res.json({ code: 200, msg: "success" });
        }
    })
});


/**
 * **********************************************评论管理************************************************
 */
router.get("/comment/getList", (req, res) => {
    let obj = req.query;
    let sql = `SELECT t1.id,t1.aid,t1.username,t1.QQ,t1.email,t1.content,t1.createAt,t1.parentId,t1.parentUsername,t2.title 
    FROM lomaBlog_article_comment as t1 left join lomaBlog_article as t2 on t1.aid=t2.aid WHERE t1.status=0 limit ${(obj.page - 1) * 20},20`;
    sqlConnect.query(sql, [], (err, result1, fields) => {
        if (err) {
            res.json({ code: 500, msg: err });
            return;
        };
        sql = "SELECT count(*) as total FROM lomaBlog_article_comment WHERE status=0";
        sqlConnect.query(sql, [], (err, result2, fields) => {
            if (err) {
                res.json({ code: 500, msg: err });
                return;
            };
            res.json({ code: 200, data: result1, total: result2[0].total, msg: "success" });
        })
    })
})

router.get("/comment/deleteById", (req, res) => {
    let obj = req.query;
    // let sql = `DELETE FROM lomaBlog_article_comment WHERE id=?`;
    // sqlConnect.query(sql, [obj.id], (err, result1, fields) => {
    //     if (err) throw err;
    deleteComment(res, sqlConnect, obj.id);
    // })
})

//删除该评论下的子评论
function deleteComment(res, sqlConnect, id) {
    let sql = `DELETE FROM lomaBlog_article_comment WHERE id=?`;
    sqlConnect.query(sql, [id], (err, result1, fields) => {
        if (err) {
            res.json({ code: 500, msg: err });
            return;
        };
        sql = "SELECT * FROM lomaBlog_article_comment WHERE parentId=?";
        sqlConnect.query(sql, [id], (err, result2, fields) => {
            if (err) {
                res.json({ code: 500, msg: err });
                return;
            };
            if (result2.length === 0) {
                res.json({ code: 200, msg: "success" });
                return;
            }
            for (let i = 0; i < result2.length; i++) {
                deleteComment(res, sqlConnect, result2[i].id);
            }
        })
    })

}

module.exports = router;