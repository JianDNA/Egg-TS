import { Controller } from 'egg';
import AddRoleRule from '../validate/addRoleRule';

export default class RolesController extends Controller {
  public async index() {
    const { ctx } = this;
    try {
      let data;
      if (JSON.stringify(ctx.query) !== '{}') {
        data = await ctx.service.roles.getRolesList(ctx.query);
        ctx.success(data);
      } else {
        data = await ctx.service.roles.getAllRoles();
        ctx.success(data);
      }

    } catch (e) {
      ctx.error(500, e.message);
    }
  }
  public async create() {
    const { ctx } = this;
    const data = ctx.request.body;
    try {
      // 1.校验数据和验证码
      ctx.validate(AddRoleRule, data);
      // 2.将校验通过的数据保存到数据库中
      const role = await ctx.service.roles.createRole(data);
      ctx.success(role);
    } catch (e) {
      if (e.errors) {
        ctx.error(400, e.errors);
      } else {
        ctx.error(400, e.message);
      }
    }
  }
  public async destroy() {
    const { ctx } = this;
    const { id } = ctx.params;
    try {
      const user = await ctx.service.roles.destroyRole(id);
      ctx.success(user);
    } catch (e) {
      ctx.error(400, e.message);
    }
  }
  public async update() {
    const { ctx } = this;
    const { id } = ctx.params;
    const data = ctx.request.body;
    try {
      // 1.校验数据和验证码
      ctx.validate(AddRoleRule, data);
      // 2.将校验通过的数据保存到数据库中
      const role = await ctx.service.roles.updateRole(id, data);
      ctx.success(role);
    } catch (e) {
      if (e.errors) {
        ctx.error(400, e.errors);
      } else {
        ctx.error(400, e.message);
      }
    }
  }
}
