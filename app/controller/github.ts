import { Controller } from 'egg';
const queryString = require('querystring');
const jwt = require('jsonwebtoken');
import { v4 as uuidv4 } from 'uuid';

export default class GithubController extends Controller {
  public async getLoginView() {
    const { ctx } = this;
    // 1.获取第三方登录界面
    // 发送get请求到 https://github.com/login/oauth/authorize 带上一些参数
    // client_id  :判断有没有接入,同时返回应用名称
    // scope : 授权范围
    const baseUrl = 'https://github.com/login/oauth/authorize';
    const option = {
      client_id: 'b3efbde43f27c55acb4e',
      scope: 'user',
    };
    const url = baseUrl + '?' + queryString.stringify(option);
    ctx.redirect(url);
  }

  public async getAccessToken() {
    const { ctx } = this;
    // 1.拿到用户同意授权的code
    const { code } = ctx.query;
    // console.log(code, '++++++');
    // 2.利用code换取令牌
    // 发送post到 https://github.com/login/oauth/access_token
    const baseUrl = 'https://github.com/login/oauth/access_token';
    const option = {
      client_id: 'b3efbde43f27c55acb4e',
      client_secret: '15db373d3f45db10660750fda0180af84b9b35f2',
      code,
    };
    const result = await ctx.curl(baseUrl, {
      method: 'POST',
      data: option,
      dataType: 'json',
      headers: {
        'ConTent-Type': 'application/json',
        Accept: 'application/json',
      },
    });
    // {
    //   access_token: '499910e9dff29973dace592be437e9a1da3e3b63',
    //       token_type: 'bearer',
    //     scope: 'user'
    // }
    // console.log(result, 'result');
    const accessToken = result.data.access_token;
    // 3.拿着令牌去github资源服务器获取数据
    await this.getGitHubInfo(accessToken);
  }

  private async getGitHubInfo(accessToken) {
    const { ctx } = this;
    console.log(accessToken);
    const baseUrl = 'https://api.github.com/user';
    const result = await ctx.curl(baseUrl, {
      method: 'GET',
      headers: {
        // token
        Authorization: `token ${accessToken}`,
        Accept: 'application/vnd.github.v3+json',
      },
    });
    const user = JSON.parse(result.data.toString());
    user.provider = 'github';
    await this.go2Admin(user, accessToken);
  }
  private async go2Admin(data, accessToken) {
    const { ctx } = this;
    try {
      // 用户存在直接登录
      const user = await ctx.service.oauth.getOauthUser(data);
      // 我们想在后端直接登录, 但是我们无法在后端设置前端的sessionStorage, 而前端的鉴权是通过sessionStorage完成的, 所以应该改变鉴权逻辑, 通过cookie来完成
      const token = jwt.sign(user, this.config.keys, { expiresIn: '7 days' });
      ctx.cookies.set('token', token, {
        path: '/',
        maxAge: 24 * 60 * 60 * 1000,
        // 如果设置为true, 那么前端无法获取这个cookie, 前端无法鉴权
        httpOnly: false,
        signed: false,
      });
      ctx.redirect('http://127.0.0.1:8080/admin');
      ctx.body = user;
    } catch (e) {
      // 用户不存在, 先注册再登录
      // 1.创建一个用户
      // ctx.body = uuidv4();
      const userInfo = {
        username: uuidv4(),
        password: 'abc123456',
        github: 1,
      };
      const user = await ctx.service.user.createUser(userInfo);
      // 2.保存用户信息
      const oauthInfo = {
        accessToken,
        provider: data.provider,
        uid: data.id,
        userId: user.id,
      };
      await ctx.service.oauth.createOauth(oauthInfo);
      const token = jwt.sign(user, this.config.keys, { expiresIn: '7 days' });
      ctx.cookies.set('token', token, {
        path: '/',
        maxAge: 24 * 60 * 60 * 1000,
        // 如果设置为true, 那么前端无法获取这个cookie, 前端无法鉴权
        httpOnly: false,
        signed: false,
      });
      // 3.直接登录(跳转到admin)
      ctx.redirect('http://127.0.0.1:8080/admin');
    }
  }
}
