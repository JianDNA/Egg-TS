import { Controller } from 'egg';
import NormalUserRule from '../validate/normalUserRule';
import EmailUserRule from '../validate/emailUserRule';
import PhoneUserRule from '../validate/phoneUserRule';
// const jwt = require('jsonwebtoken');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const jwt = require('jsonwebtoken');

const enum TypeEnum {
  Normal = 'normal',
  Email = 'email',
  Phone ='phone'
}
export default class UserController extends Controller {
  public async isLogin() {
    const { ctx } = this;
    /*    const user = ctx.session.user;
    if (user) {
      ctx.success(user);
    } else {
      ctx.error(401, '还没有登录');
    }*/
    // const { token } = ctx.query;
    const token = ctx.get('Authorization');
    console.log(token);
    /**
     * 校验方法
     * 第一个参数: token
     * 第二个参数: 当初加密的密钥
     */
    try {
      const user = jwt.verify(token, this.config.keys);
      ctx.success(user);
    } catch (e) {
      ctx.error(400, e.message);
    }
  }
  public async index() {
    const { ctx } = this;
    try {
      // 1.校验数据和验证码
      this.validateUserInfo();
      const data = ctx.request.body;
      ctx.helper.verifyImageCode(data.captcha);
      // 2.将校验通过的数据保存到数据库
      const user = await ctx.service.user.getUser(data);
      delete user.password;
      // 校验用户是否可用
      if (!user.userState) {
        return ctx.error(400, '用户已经注销!');
      }
      // 3.保存用户登录状态
      // ctx.session.user = user;
      // 3.生成jwt令牌
      const obj: any = {};
      obj.username = user.username;
      obj.email = user.email;
      obj.phone = user.phone;
      /**
       * 第一个参数: 需要保存的数据
       * 第二个参数: 签名使用的密钥
       * 第三个参数: 额外配置
       */
      const token = jwt.sign(obj, this.config.keys, { expiresIn: '7 days' });
      // user.token = token;
      ctx.cookies.set('token', token, {
        path: '/',
        maxAge: 24 * 60 * 60 * 1000,
        // 如果设置为true, 那么前端无法获取这个cookie, 前端无法鉴权
        httpOnly: false,
        signed: false,
      });
      ctx.session.user = user;
      ctx.success(user);
    } catch (e) {
      if (e.errors) {
        ctx.error(400, e.errors);
      } else {
        ctx.error(400, e.message);
      }
    }
  }
  public async create() {
    const { ctx } = this;
    try {
      // 1.校验数据 and 校验验证码
      this.validateUserInfo();
      this.validateUserCode();
      // 2.将校验通过的数据保存到数据库
      const data = await ctx.service.user.createUser(ctx.request.body);
      // ctx.body = '注册';
      ctx.success({ data });
    } catch (e) {
      if (e.errors) {
        ctx.error(400, e.errors);
      } else {
        ctx.error(400, e.message);
      }
    }
  }

  // 校验验证码
  private validateUserCode() {
    const { ctx } = this;
    const data = ctx.request.body;
    const type = data.type;
    switch (type) {
      case TypeEnum.Normal:
        // 校验验证码是否正确
        ctx.helper.verifyImageCode(data.captcha);
        break;
      case TypeEnum.Email:
        // 校验验证码是否正确
        ctx.helper.verifyEmailCode(data.captcha);
        break;
      case TypeEnum.Phone:
        // 校验验证码是否正确
        ctx.helper.verifySmsCodee(data.captcha);
        break;
      default:
        throw new Error('注册类型不存在');
    }
  }
  // 校验注册数据
  private validateUserInfo() {
    const { ctx } = this;
    const data = ctx.request.body;
    const type = data.type;
    switch (type) {
      case TypeEnum.Normal:
        // 校验数据格式是否正确
        ctx.validate(NormalUserRule, data);
        break;
      case TypeEnum.Email:
        // 校验数据格式是否正确
        ctx.validate(EmailUserRule, data);
        break;
      case TypeEnum.Phone:
        // 校验数据格式是否正确
        ctx.validate(PhoneUserRule, data);
        // 校验验证码是否正确
        break;
      default:
        throw new Error('注册类型不存在');
    }
  }
}
