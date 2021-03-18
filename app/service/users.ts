import { Service } from 'egg';
const { Op } = require('sequelize');
import {Role} from "../model/role";
export default class User extends Service {

  public async getAll() {
    return this.ctx.model.User.findAll({
      attributes: {
        exclude: [ 'password', 'created_at', 'updated_at' ],
      },
    });
  }

  public async getUserList(obj) {
    const currentPage = parseInt(obj.currentPage) || 1;
    const pageSize = parseInt(obj.pageSize) || 5;
    const { role, origin, type, key } = obj;
    const defaultCondition = {
      [Op.or]: [
        { username: { [Op.substring]: key } },
        { email: { [Op.substring]: key } },
        { phone: { [Op.substring]: key } },
      ],
    };
    if (key || role || origin || type) {
      // 如果有附加条件, 必须同时满足多个条件
      const conditionList: any[] = [];
      if (key) {
        conditionList.push(defaultCondition);
      }
      if (role) {
        console.log(role);
      }
      if (origin) {
        // {github: true} || {local: true}
        conditionList.push({ [origin]: true });
      }
      if (type) {
        // {username: 123} || {email: 123} || {email: phone}
        conditionList.push({ [type]: { [Op.substring]: key } });
      }
      const users = await this.ctx.model.User.findAll({
        attributes: {
          exclude: [ 'password', 'created_at', 'updated_at' ],
        },
        include: [
          { model: Role },
        ],
        limit: pageSize,
        offset: (currentPage - 1) * pageSize,
        where: {
          [Op.and]: conditionList,
        },
      });
      const totalCount = await this.ctx.model.User.findAndCountAll({
        where: {
          [Op.and]: conditionList,
        },
      });
      return { users, totalCount: totalCount.count };
    }
    const users = await this.ctx.model.User.findAll({
      attributes: {
        exclude: [ 'password', 'created_at', 'updated_at' ],
      },
      include: [
        { model: Role },
      ],
      limit: pageSize,
      offset: (currentPage - 1) * pageSize,
    });
    const totalCount = await this.ctx.model.User.findAndCountAll();
    return { users, totalCount: totalCount.count };

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
