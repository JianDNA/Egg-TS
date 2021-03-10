import { Controller } from 'egg';
import AddUserRule from '../validate/addUserRule';
import EditUserRule from '../validate/editUserRule';
const path = require('path');
const fs = require('fs');
const xlsx = require('node-xlsx');

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
      !data.phone && delete data.phone;
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

  public async posts() {
    const { ctx } = this;
    // 1.拿到上传过来的文件
    // 注意点: 在Egg中想要实现文件上传, 必须进行配置
    const file = ctx.request.files[0];
    // 2. 生成独一无二的文件名称
    const fileName = ctx.helper.encryptText(file.filename + Date.now()) + path.extname(file.filename);
    // 3. 生成存储文件的路径
    let filePath = path.join('/public/upload', fileName);
    const absFilePath = path.join(this.config.baseDir, 'app', filePath);
    console.log(absFilePath);
    // // 4.写入文件
    const readStream = fs.readFileSync(file.filepath);
    fs.writeFileSync(absFilePath, readStream);
    // 5.返回存储图片的路径
    filePath = filePath.replace(/\\/g, '/');
    ctx.success(filePath);
  }

  public async importUser() {
    const { ctx } = this;
    let transaction;
    try {
      const file = ctx.request.files[0];
      // 1.读取Excel文件
      const workSheets = xlsx.parse(fs.readFileSync(file.filepath));
      // 2.获取到需要操作的那一页的对象
      const sheet1 = workSheets.length ? workSheets[0] : null;
      const sheet1Data = sheet1 ? sheet1.data : [];
      const users: any[] = [];
      // 开启事务
      transaction = await ctx.model.transaction();
      for (let i = 1; i < sheet1Data.length; i++) {
        // 获取到所有的key
        const cloumnTitles = sheet1Data[0];
        // 获取到当前行的数据
        const cloumnValues = sheet1Data[i];
        const user = {};
        for (let j = 0; j < cloumnTitles.length; j++) {
          user[cloumnTitles[j]] = cloumnValues[j];
        }
        await ctx.service.users.createUser(user);
        users.push(user);
      }
      // 提交事务
      await transaction.commit();
      ctx.success(users);
    } catch (e) {
      // 回滚事务
      await transaction.rollback();
      ctx.error(500, e.message);
    }
  }

}
