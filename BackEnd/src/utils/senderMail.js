import nodemailer from "nodemailer"

// async..await is not allowed in global scope, must use a wrapper
export const senderMail = async (to, html) => {
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'chushop935@gmail.com', // generated ethereal user
            pass: 'rrut bjvc skop yovw'
        },
        tls: {
            rejectUnauthorized: false, // avoid nodejs self signed certificate error
        },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: 'chushop935@gmail.com', // sender address
        to, // list of receivers
        subject: 'Shop A-Shirt thông báo', // Subject line
        text: 'Hello world?', // plain text body
        html,
        replyTo: 'chushop935@gmail.com'
    });

    console.log('Message sent: %s', info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
};