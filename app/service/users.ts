import { Service } from 'egg';

export default class User extends Service {

  public async getAll() {
    return this.ctx.model.User.findAll();
  }
  public async createUser(obj) {
    obj.password = this.ctx.helper.encryptText(obj.password);
    const { username, email, phone } = obj;
    let user = await this.ctx.model.User.findOne({ where: { username } });
    if (user) {
      throw new Error('用户名已存在');
    }
    user = await this.ctx.model.User.findOne({ where: { email } });
    if (user) {
      throw new Error('邮箱已存在');
    }
    user = await this.ctx.model.User.findOne({ where: { phone } });
    if (user) {
      throw new Error('手机已存在');
    }

    // 2.如果不存在才保存
    const data = await this.ctx.model.User.create(obj);
    console.log('插入新用户', data);
    const userdata = (data as any).dataValues;
    delete userdata.password;
    return userdata;
  }
}
