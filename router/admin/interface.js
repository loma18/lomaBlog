let express = require("express");
let router = express.Router();
const qs = require("querystring");
const sqlConnect = require('../../sqlConnect');

/**获取接口模块 */
router.get("/interface/getModuleList", (req, res) => {
    let sql = "SELECT*FROM lomaBlog_interfaceGroup";
    sqlConnect.query(sql, [], (err, result, fields) => {
        if (err) {
            res.json({ code: 500, msg: err });
            return;
        };
        let arr = [];
        if (result.length > 0) {
            result.map(item => {
                arr.push({ id: item.gid, title: item.title });
            })
        }
        res.json({ code: 200, data: arr, msg: "success" });
    })
});

/**保存接口模块 */
router.post("/interface/module/save", (req, res) => {
    req.on("data", (data) => {
        let str = data.toString(),
            obj = JSON.parse(str),
            sql = "",
            params = [];
        if (obj.id) {
            sql = "UPDATE lomaBlog_interfaceGroup SET title=? WHERE gid=?";
            params = [obj.title, obj.id];
        } else {
            sql = "INSERT INTO lomaBlog_interfaceGroup VALUES(null,?)";
            params = [obj.title];
        }
        sqlConnect.query(sql, params, (err, result, fields) => {
            if (err) {
                res.json({ code: 500, msg: err });
                return;
            };
            if (result.affectedRows > 0) {
                res.json({ code: 200, msg: "success" });
            } else {
                res.json({ code: 500, msg: "error" });
            }
        });
    })
});

/**删除接口模块 */
router.get("/interface/module/delete", (req, res) => {
    let obj = req.query;
    let sql = "DELETE FROM lomaBlog_interfaceGroup WHERE gid=?",
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

/**保存接口 */
router.post("/interface/save", (req, res) => {
    req.on("data", (data) => {
        let str = data.toString(),
            obj = JSON.parse(str),
            sql = "",
            params = [];
        if (obj.id) {
            sql = "UPDATE lomaBlog_interface SET moduleId =?,fieldList=?,paramType=?,methods=?,title=?,routePath=?,resFieldList=? WHERE id=?";
        } else {
            sql = "INSERT INTO lomaBlog_interface VALUES(null,?,?,?,?,?,?,?)";
        }
        params = [obj.moduleId, obj.fieldList, obj.paramType, obj.methods, obj.title, obj.routePath, obj.resFieldList, obj.id];
        sqlConnect.query(sql, params, (err, result, fields) => {
            if (err) {
                res.json({ code: 500, msg: err });
                return;
            };
            if (result.affectedRows > 0) {
                res.json({ code: 200, msg: "success" });
            } else {
                res.json({ code: 500, msg: "error" });
            }
        });
    })
});

/**获取接口列表 */
router.get("/interface/getList", (req, res) => {
    let sql = "SELECT t1.title,t1.routePath,t1.moduleId,t1.id,t2.title as titles FROM lomaBlog_interface as t1 left join lomaBlog_interfaceGroup as t2 on t1.moduleId = t2.gid";
    sqlConnect.query(sql, [], (err, result, fields) => {
        if (err) {
            res.json({ code: 500, msg: err });
            return;
        };
        let arr = [],
            obj = {};
        if (result.length > 0) {
            result.map((item, key) => {
                if (!obj[item.moduleId]) {
                    obj[item.moduleId] = { title: item.titles, value: [] }
                }
                obj[item.moduleId].value.push({
                    id: item.id,
                    title: item.title,
                    routePath: item.routePath
                });
            })
            for (let key in obj) {
                arr.push({
                    id: key,
                    title: obj[key].title,
                    children: obj[key].value
                })
            }
        }
        res.json({ code: 200, data: arr, msg: "success" });
    })
});

/**获取接口详细信息 */
router.get("/interface/getDetailById", (req, res) => {
    let obj = req.query,
        sql = "SELECT*FROM lomaBlog_interface WHERE id=?",
        params = [obj.id];
    sqlConnect.query(sql, params, (err, result, fields) => {
        if (err) {
            res.json({ code: 500, msg: err });
            return;
        };
        if (result.length > 0) {
            res.json({ code: 200, data: result[0], msg: "success" });
        }
    })
});

/**删除接口 */
router.get("/interface/delete", (req, res) => {
    let obj = req.query,
        sql = "DELETE FROM lomaBlog_interface WHERE id=?",
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

module.exports = router;