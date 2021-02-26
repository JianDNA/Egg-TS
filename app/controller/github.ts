import { Controller } from 'egg';
const queryString = require('querystring');


export default class GithubController extends Controller {
  public async loginView() {
    const { ctx } = this;
    console.log(3344, '++++++++++++');
    // 1.获取第三方登录界面
    // 发送get请求到 https://github.com/login/oauth/authorize 带上一些参数
    // client_id  :判断有没有接入,同时返回应用名称
    // scope : 授权范围
    const baseUrl = 'https://github.com/login/oauth/authorize';
    const option = {
      client_id: '6969ec2aed124ac0e6e5',
      scope: 'user',
    };
    const url = baseUrl + '?' + queryString.stringify(option);
    console.log(url);
    // ctx.body = await ctx.model.User.findAll();
    ctx.redirect(url);
  }
}
