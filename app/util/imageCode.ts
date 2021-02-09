import svgCaptcha = require('svg-captcha');

export default {
  createImageCode(ctx) {
    // 1.生成验证码
    const c = svgCaptcha.create({
      size: 4, // 验证码长度
      width: 160, // 验证码图片宽度
      height: 60, // 验证码图片高度
      fontSize: 50, // 验证码文字大小
      ignoreChars: '0oO1ilI', // 验证码字符中排除内容 0o1i
      noise: 4, // 干扰线条的数量
      color: true, // 验证码的字符是否有颜色，默认没有，如果设定了背景，则默认有
      background: '#eee', // 验证码图片背景颜色
    });
    // console.log(c); // {text: 验证码字符串, data: 验证码对应的svg图片}
    // 保存生成的验证码
    ctx.session.captcha = {
      code: c.text,
      expire: Date.now() + 60 * 1000, // 验证码一分钟后过期
    };
    // 返回验证码
    console.log(c.text);
    return c.data;
  },
  verifyImageCode(ctx, clinetCode) {
    // 1.取出服务端中保存的验证码和过期时间
    const serverCaptcha = ctx.session.captcha;
    let serverCode;
    let serverExpire;
    try {
      serverCode = serverCaptcha.code;
      serverExpire = serverCaptcha.expire;
    } catch (e) {
      // 注意点: 验证码无论验证成功还是失败, 只能用一次
      ctx.session.captcha = null;
      throw new Error('请重新获取验证码');
    }
    // 2.获取客户端传递过来的验证码
    if (Date.now() > serverExpire) {
      // 注意点: 验证码无论验证成功还是失败, 只能用一次
      ctx.session.captcha = null;
      throw new Error('验证码已过期');
    } else if (serverCode !== clinetCode) {
      // 注意点: 验证码无论验证成功还是失败, 只能用一次
      ctx.session.captcha = null;
      throw new Error('验证码不正确');
    }
    // 注意点: 验证码无论验证成功还是失败, 只能用一次
    ctx.session.captcha = null;
  },
};
