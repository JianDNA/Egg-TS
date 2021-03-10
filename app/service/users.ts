import { Service } from 'egg';

export default class User extends Service {

  public async getAll() {
    return this.ctx.model.User.findAll({
      attributes: {
        exclude: [ 'password', 'created_at', 'updated_at' ],
      },
    });
  }
  public async createUser(obj) {
    obj.password = this.ctx.helper.encryptText(obj.password);
    const { username, email, phone } = obj;
    let user;
    if (username) {
      user = await this.ctx.model.User.findOne({ where: { username } });
      if (user) {
        throw new Error('用户名已存在');
      }
    } else {
      delete obj.username;
    }

    if (email) {
      user = await this.ctx.model.User.findOne({ where: { email } });
      if (user) {
        throw new Error('邮箱已存在');
      }
    } else {
      delete obj.email;
    }

    if (phone) {
      user = await this.ctx.model.User.findOne({ where: { phone } });
      if (user) {
        throw new Error('手机已存在');
      }
    } else {
      delete obj.phone;
    }

    // 2.如果不存在才保存
    const data = await this.ctx.model.User.create(obj);
    console.log('插入新用户', data);
    const userdata = (data as any).dataValues;
    delete userdata.password;
    return userdata;
  }

  public async deleteUser(id) {
    const user = await this.ctx.model.User.findByPk(id);
    if (user) {
      const data = await this.ctx.model.User.destroy({
        where: { id },
      });
      if (data > 0) {
        return user;
      }
      throw new Error('删除用户失败');
    } else {
      throw new Error('删除用户不存在');
    }
  }

  public async updateUser(id, obj) {
    const user = await this.ctx.model.User.findByPk(id);
    if (user) {
      const data = await this.ctx.model.User.update(obj, {
        where: { id },
      });
      if (data.length > 0) {
        return user;
      }
      throw new Error('更新用户失败');

    } else {
      throw new Error('删除用户不存在');
    }
  }
}
