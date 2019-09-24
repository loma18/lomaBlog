const nodemailer = require('nodemailer')
let smtpTransport = require('nodemailer-smtp-transport');

const emailFrom = {
    service: 'qq',
    user: '909622852@qq.com',
    pass: 'blzvrgajvskpbfbe',
}

const emailTo = {
    service: '163',
    user: '909622852@163.com'
}

smtpTransport = nodemailer.createTransport(smtpTransport({
    service: emailFrom.service,
    auth: {
        user: emailFrom.user,
        pass: emailFrom.pass
    }
}));

function send(obj, res) {
    let htmlTpl = `<p>发送人:${obj.username}</p>
    <p>邮箱:${obj.email}</p>
    <p>内容:${obj.message}</p>`;
    smtpTransport.sendMail({

        from: emailFrom.user,
        to: emailTo.user,
        subject: obj.pointDot,
        html: htmlTpl

    }, function (error, response) {
        if (error) {
            res.json({ code: 500, msg: error })
        }
        res.json({ code: 200, msg: 'success' });
    });
}

module.exports = { send }