import { Controller } from 'egg';
import AddUserRule from '../validate/addUserRule';

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

}
