const mysql = require("mysql");

let pool = mysql.createPool({
    host: "127.0.0.1",
    user: "root",
    password: "123456",
    database: "lomaBlog",
    port: 3306,
    connectionLimit: 10
});

query=(sql, sqlParams, callback)=> {
    pool.getConnection(function (err, conn) {
        if (err) {
            callback(err, null, null);
        } else {
            conn.query(sql, sqlParams, function (qerr, vals, fields) {
                callback(qerr, vals, fields);
            });
        }
        // conn.release(); // not work!!!
        pool.releaseConnection(conn);
    });
};
module.exports = { query }