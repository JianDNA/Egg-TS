import { Controller } from 'egg';
import AddUserRule from '../validate/addUserRule';
import EditUserRule from '../validate/editUserRule';

export default class UsersController extends Controller {

  public async index() {
    const { ctx } = this;
    try {
      const users = await ctx.service.users.getAll();
      ctx.success(users);
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
      const data = ctx.request.body;
      !data.phone && delete data.phone
      // 1.校验数据
      ctx.validate(AddUserRule, data);
      // 2.将校验通过的数据保存到数据库
      const user = await ctx.service.users.createUser(ctx.request.body);
      // ctx.body = '注册';
      ctx.success(user);
    } catch (err) {
      if (err.errors) {
        ctx.error(400, err.errors);
      } else {
        ctx.error(400, err.message);
      }
    }
  }

  public async delete() {
    const { ctx } = this;
    const { id } = ctx.params;
    try {
      const users = await ctx.service.users.deleteUser(id);
      ctx.success(users);
    } catch (e) {
      ctx.error(400, e.message);
    }
  }

  public async update() {
    const { ctx } = this;
    const { id } = ctx.params;
    const data = ctx.request.body;
    delete data.createdAt;
    delete data.updatedAt;
    console.log(!data.password === true);
    !data.username && delete data.username;
    !data.password && delete data.password;
    !data.email && delete data.email;
    !data.phone && delete data.phone;
    try {
      // 1.校验数据
      ctx.validate(EditUserRule, data);
      // 2.将校验通过的数据保存到数据库
      const user = await ctx.service.users.updateUser(id, data);
      // ctx.body = '注册';
      ctx.success(user);
    } catch (err) {
      if (err.errors) {
        console.log(err.errors, '-------');
        ctx.error(400, err.errors);
      } else {
        ctx.error(400, err.message);
      }
    }
  }

}
