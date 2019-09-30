/* eslint-disable */
let express = require("express");
let router = express.Router();
const qs = require("querystring");
const sqlConnect = require('../../sqlConnect');
var fs = require('fs');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();


/**上传照片 */
router.post("/uploadPhotos", multipartMiddleware, (req, res) => {
    let sql = 'INSERT INTO lomaBlog_attachment VALUES(null,0,?,UNIX_TIMESTAMP(NOW())*1000,?)',
        file = req.files.file,
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
            params = [fileList[i].name, uploadDir + fileList[i].path.split(['\\']).slice(-1)[0]];
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
});


/** 删除照片*/
router.get("/photos/delete", (req, res) => {
    let obj = req.query,
        sql = 'SELECT id,file_path FROM lomaBlog_attachment WHERE id=?',
        delId = [],
        tempStr = '';
    sqlConnect.query(sql, [obj.id], (err, result, fields) => {
        if (err) {
            res.json({ code: 500, msg: err });
            return;
        }
        sql = `DELETE FROM lomaBlog_attachment WHERE id =?`;
        fs.unlink(result[0].file_path, function () {
            sqlConnect.query(sql, [obj.id], (err, result, fields) => {
                if (err) {
                    res.json({ code: 500, msg: err });
                    return;
                }
                res.json({ code: 200, msg: 'success' })
            })
        });
    })
});


/** 获取照片列表*/
router.get("/getPhotosList", (req, res) => {
    let sql = "SELECT id,file_name,file_path FROM lomaBlog_attachment WHERE aid=0 order by createAt desc",
        //  + (obj.searchValue ? " AND description LIKE '%" + obj.searchValue + "%' " : ' ') +
        //     "order by createAt desc limit " + (obj.page - 1) * 20 + ",20",
        params = [];
    sqlConnect.query(sql, params, (err, result, fields) => {
        if (err) {
            res.json({ code: 500, msg: err });
            return;
        };
        for (let i = 0; i < result.length; i++) {
            result[i].url = '/attachment/' + result[i].file_path.split(/\//).slice(-1)[0]
        }
        res.json({ code: 200, data: result, msg: 'success' })
    })

});

module.exports = router;