/**
 * Created by Administrator on 2016/5/19.
 */


/******************************************************************************/
function sendMail(infoData){
    var nodemailer = require('nodemailer');
    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'gdutjiweijin@gmail.com',
            pass: 'jiweijin921111'
        }
    });

    var mailOptions = {
        from: 'gdutjiwejin',
        to: 'gdut_jiweijin@sina.com',
        subject: '最新通知',
        text: infoData.title,
        html: infoData.content
    };

    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            console.log(error);
        }else{
            console.log('Message sent: ' + info.response);
        }
    });

}

module.exports.sendMail=sendMail;