import { Controller } from 'egg';


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

}
