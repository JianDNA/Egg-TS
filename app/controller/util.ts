import { Controller } from 'egg';
const nodemailer = require('nodemailer');


export default class UtilController extends Controller {
  public async imageCode() {
    const { ctx } = this;
    ctx.body = ctx.helper.createImageCode();
  }
  public async emailCode() {
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    // const testAccount = await nodemailer.createTestAccount();

    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
      host: 'smtp.qq.com',
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: '2210021@qq.com', // generated ethereal user
        pass: 'plodbybvogirbgbf', // generated ethereal password
      },
    });
    const code = Math.random().toString(16).slice(2, 6)
      .toUpperCase();
    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: '2210021@qq.com', // sender address
      to: '1109632473@qq.com', // list of receivers
      subject: '管理后台注册验证码', // Subject line
      text: `您正在注册管理后台系统, 您的验证码是:${code}`, // plain text body
    });
    // send mail
    transporter.sendMail(info, (err, data) => {
      if (err) {
        console.log('发送邮件失败', err);
      } else {
        console.log('发送邮件成功', data);
      }
    });
  }
}
