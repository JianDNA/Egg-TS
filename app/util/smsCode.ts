import Core = require('@alicloud/pop-core');

let transporter;
export default {
  // 创建发送邮件对象
  createTransportInstance(ctx) {
    if (!transporter) {
      // create reusable transporter object using the default SMTP transport
      transporter = new Core({
        accessKeyId: ctx.app.config.sms.accessKeyId,
        accessKeySecret: ctx.app.config.sms.secretAccessKey,
        endpoint: 'https://dysmsapi.aliyuncs.com',
        apiVersion: '2017-05-25',
      });
    }
    return transporter;
  },
  // 创建需要法硕的内容
  createSmsInfo(ctx, to:string) {
    // 1.生成验证码
    const code = Math.random().toString(16).slice(2, 6)
      .toUpperCase();
    // 2. send mail with defined transport object
    const jsonCode = { code };
    const info = {
      RegionId: 'cn-hangzhou',
      PhoneNumbers: to,
      SignName: 'ABC商城',
      TemplateCode: 'SMS_205879489',
      TemplateParam: JSON.stringify(jsonCode),
    };
    // 3.保存验证码
    ctx.session.sms = {
      code,
      expire: Date.now() + 60 * 1000,
    };
    return info;
  },
  // 发送短信验证码
  async sendSmsCode(ctx, to:string) {
    const transporter = this.createTransportInstance(ctx);
    const info = this.createSmsInfo(ctx, to);
    // send mail
    const requestOption = {
      method: 'POST',
    };
    return new Promise((resolve, reject) => {
      transporter.request('SendSms', info, requestOption).then(result => {
        console.log(JSON.stringify(result));
        resolve(result);
      }, ex => {
        reject(ex);
      });
    });
  },
  // 校验验证码
  verifySmsCode(ctx, clientCode) {
    // 1.取出服务端中保存的验证码和过期时间
    const serverCaptcha = ctx.session.sms;
    let serverCode;
    let serverExpire;
    try {
      serverCode = serverCaptcha.code;
      serverExpire = serverCaptcha.expire;
    } catch (e) {
      throw new Error('请重新获取验证码');
    }
    // 2.获取客户端传递过来的验证码
    if (Date.now() > serverExpire) {
      throw new Error('验证码已过期');
    } else if (serverCode !== clientCode) {
      throw new Error('验证码不正确');
    }
    // 注意点: 验证码无论验证成功还是失败, 只能用一次
    ctx.session.email = null;
  },
};
