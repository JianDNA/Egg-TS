import nodemailer = require('nodemailer');

let transporter;
export default {
  // 创建发送邮件对象
  createTransportInstance(ctx) {
    if (!transporter) {
      // create reusable transporter object using the default SMTP transport
      transporter = nodemailer.createTransport({
        host: ctx.app.config.smtp.host,
        port: ctx.app.config.smtp.port,
        secure: true, // true for 465, false for other ports
        auth: {
          user: ctx.app.config.smtp.user, // generated ethereal user
          pass: ctx.app.config.smtp.pass, // generated ethereal password
        },
      });
    }
    return transporter;
  },
  // 创建需要法硕的内容
  createEmailInfo(ctx, to:string) {
    // 1.生成验证码
    const code = Math.random().toString(16).slice(2, 6)
      .toUpperCase();
    // 2. send mail with defined transport object
    const info = {
      from: '2210021@qq.com', // sender address
      to, // list of receivers
      subject: '管理后台注册验证码', // Subject line
      text: `您正在注册管理后台系统, 您的验证码是:${code}`, // plain text body
    };
    // 3.保存验证码
    ctx.session.email = {
      code,
      expire: Date.now() + 60 * 1000,
    };
    return info;
  },
  // 发送验证码
  async sendEmailCode(ctx, to:string) {
    const transporter = this.createTransportInstance(ctx);
    const info = this.createEmailInfo(ctx, to);
    // send mail
    return new Promise((resolve, reject) => {
      transporter.sendMail(info, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  },
  // 校验验证码
  verifyEmailCode(ctx, clientCode) {
    // 1.取出服务端中保存的验证码和过期时间
    const serverCaptcha = ctx.session.email;
    let serverCode;
    let serverExpire;
    try {
      serverCode = serverCaptcha.code;
      serverExpire = serverCaptcha.expire;
    } catch (e) {
      // 注意点: 验证码无论验证成功还是失败, 只能用一次
      // ctx.session.email = null;
      throw new Error('请重新获取验证码');
    }
    // 2.获取客户端传递过来的验证码
    if (Date.now() > serverExpire) {
      // 注意点: 验证码无论验证成功还是失败, 只能用一次
      // ctx.session.email = null;
      throw new Error('验证码已过期');
    } else if (serverCode !== clientCode) {
      // 注意点: 验证码无论验证成功还是失败, 只能用一次
      // ctx.session.email = null;
      throw new Error('验证码不正确');
    }
    // 注意点: 验证码无论验证成功还是失败, 只能用一次
    ctx.session.email = null;
  },
};
