import { Controller } from 'egg';


export default class UtilController extends Controller {
  public async imageCode() {
    const { ctx } = this;
    // 设置返回类型, 告诉前端返回的是一张图片
    ctx.response.type = 'image/svg+xml';
    ctx.body = ctx.helper.createImageCode();
  }
  public async emailCode() {
    const { ctx } = this;
    try {
      const { email } = ctx.query;
      const data = await ctx.helper.sendEmailCode(email);
      ctx.success(data);
    } catch (e) {
      ctx.error(400, e.message);
    }
  }
  public async smsCode() {
    const { ctx } = this;
    try {
      const { phone } = ctx.query;
      const data = await ctx.helper.sendSmsCode(phone);
      ctx.success(data);
    } catch (e) {
      ctx.error(400, e.message);
    }
  }
}
