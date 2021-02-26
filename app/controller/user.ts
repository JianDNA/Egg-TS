import { Controller } from 'egg';
import NormalUserRule from '../validate/normalUserRule';
import EmailUserRule from '../validate/emailUserRule';
import PhoneUserRule from '../validate/phoneUserRule';
const enum TypeEnum {
  Normal = 'normal',
  Email = 'email',
  Phone ='phone'
}
export default class UserController extends Controller {
  public async create() {
    const { ctx } = this;
    try {
      // 1.校验数据
      this.validateUserInfo();
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

  // 校验注册数据
  private validateUserInfo() {
    const { ctx } = this;
    const data = ctx.request.body;
    const type = data.type;
    switch (type) {
      case TypeEnum.Normal:
        // 校验数据格式是否正确
        ctx.validate(NormalUserRule, data);
        // 校验验证码是否正确
        ctx.helper.verifyImageCode(data.captcha);
        break;
      case TypeEnum.Email:
        // 校验数据格式是否正确
        ctx.validate(EmailUserRule, data);
        // 校验验证码是否正确
        ctx.helper.verifyEmailCode(data.captcha);
        break;
      case TypeEnum.Phone:
        // 校验数据格式是否正确
        ctx.validate(PhoneUserRule, data);
        // 校验验证码是否正确
        ctx.helper.verifySmsCodee(data.captcha);
        break;
      default:
        throw new Error('注册类型不存在');
    }
  }
}
