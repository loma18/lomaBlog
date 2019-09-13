
let constants = require('./constants');
//通过req的hearers来获取客户端ip
const getIp = function (req) {
    var ip = req.headers['x-real-ip'] || req.headers['x-forwarded-for'] || req.connection.remoteAddres || req.socket.remoteAddress || '';
    if (ip.split(',').length > 0) {
        ip = ip.split(',')[0];
    }
    return ip;
};

const getMIME = function (ext) {
    return constants.mimeType[ext] ? constants.mimeType[ext] : 'text/plain';
}

module.exports = { getIp, getMIME }