import { v4 as uuidv4 } from 'uuid';
const jwt = require('jsonwebtoken');
module.exports = app => {
  app.passport.verify(async (ctx, user) => {
    // 从数据库中查找用户信息
    try {
      const existsUser = await ctx.service.oauth.getOauthUser(user);
      const token = jwt.sign(existsUser, app.config.keys, { expiresIn: '7 days' });
      ctx.cookies.set('token', token, {
        path: '/',
        maxAge: 24 * 60 * 60 * 1000,
        // 如果设置为true, 那么前端无法获取这个cookie, 前端无法鉴权
        httpOnly: false,
        signed: false,
      });
      return existsUser;
    } catch (e) {
      // 调用 service 注册新用户
      // 用户不存在, 先注册再登录
      // 1.创建一个用户
      const userInfo = {
        username: uuidv4(),
        password: 'abc123456',
        github: 1,
      };
      const newUser = await ctx.service.user.createUser(userInfo);
      // 2.保存用户信息
      const oauthInfo = {
        accessToken: user.accessToken,
        provider: user.provider,
        uid: user.id,
        userId: newUser.id,
      };
      await ctx.service.oauth.createOauth(oauthInfo);
      const token = jwt.sign(newUser, app.config.keys, { expiresIn: '7 days' });
      ctx.cookies.set('token', token, {
        path: '/',
        maxAge: 24 * 60 * 60 * 1000,
        // 如果设置为true, 那么前端无法获取这个cookie, 前端无法鉴权
        httpOnly: false,
        signed: false,
      });
      return newUser;
    }
  });
};
