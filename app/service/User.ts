import { Service } from 'egg';

export default class User extends Service {

  public async getUser({ username, email, phone, password }) {
    password = this.ctx.helper.encryptText(password);
    console.log(password);
    let res;
    if (email) {
      res = await this.findUser({ email, password });
    } else if (phone) {
      res = await this.findUser({ phone, password });
    } else if (username) {
      res = await this.findUser({ username, password });
    }
    try {
      return res.dataValues;
    } catch (e) {
      throw new Error('用户名或者密码不正确');
    }
  }

  public async createUser({ username, email, phone, password }) {
    password = this.ctx.helper.encryptText(password);
    if (username) {
      // 普通注册
      return await this.createUserByUserName(username, password);
    } else if (email) {
      // 邮箱注册
      return await this.createUserByEmail(email, password);
    } else if (phone) {
      // 手机注册
      return await this.createUserByPhone(phone, password);
    }
  }

  private async createUserByUserName(username: string, password:string) {
    // 1.查询当前用户是否存在
    const user = await this.findUser({ username });
    if (user) {
      throw new Error('用户已存在');
    }
    // 2.如果不存在才保存
    const data = await this.ctx.model.User.create({
      username,
      password,
    } as any);
    console.log('插入新用户', data);
    const userdata = (data as any).dataValues;
    delete userdata.password;
    return userdata;
  }

  private async createUserByEmail(email, password) {
    // 1.查询用户是否存在
    const user = await this.findUser({ email });
    if (user) {
      throw new Error('当前用户已存在');
    }
    const data = await this.ctx.model.User.create({
      email, password,
    } as any);
    const userdata = (data as any).dataValues;
    delete userdata.password;
    return userdata;
  }
  private async createUserByPhone(phone, password) {
    // 1.查询用户是否存在
    const user = await this.findUser({ phone });
    if (user) {
      throw new Error('当前用户已存在');
    }
    const data = await this.ctx.model.User.create({
      phone, password,
    } as any);
    // console.log('插入新用户成功', data);
    const userdata = (data as any).dataValues;
    delete userdata.password;
    return userdata;
  }
  private async findUser(options) {
    return await this.ctx.model.User.findOne({ where: options });
  }
}
