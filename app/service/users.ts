import { Service } from 'egg';

export default class User extends Service {

  public async getAll() {
    return this.ctx.model.User.findAll();
  }
}
