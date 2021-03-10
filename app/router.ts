import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router } = app;
  // 自定义校验规则
  // app.validator.addRule('myUserName', (_rule, value: string) => {
  //   if (value.length < 6) return '用户名至少是6位';
  // });
  // router.get('/', controller.home.index);

  // 验证码
  require('./router/code')(app);


  // 用户登录注册
  require('./router/account')(app);

  router.get('/api/v1/users', controller.users.index);
  router.post('/api/v1/users', controller.users.create);
  router.delete('/api/v1/users/:id', controller.users.delete);
  router.put('/api/v1/users/:id', controller.users.update);
  router.post('/api/v1/posts/', controller.users.posts);
};
