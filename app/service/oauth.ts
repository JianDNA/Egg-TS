import { Service } from 'egg';
import { User } from '../model/user';
export default class Oauth extends Service {

  public async getUser({ id, provider }) {
    const { ctx } = this;
    console.log(id, provider);
    const data = await ctx.model.Oauth.findOne({
      where: {
        uid: id,
        provider,
      },
      include: [
        { model: User },
      ],
    });
    try {
      return data!.dataValues.user!.dataValues;
    } catch (e) {
      throw new Error('授权用户不存在');
    }
  }
}
