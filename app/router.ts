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

  // 用户管理
  require('./router/users')(app);


  // 角色管理
  // router.get('/api/v1/roles', controller.roles.index);
  // router.post('/api/v1/roles', controller.roles.create);
  // router.delete('/api/v1/roles/:id', controller.roles.destroy);
  // router.put('/api/v1/roles/:id', controller.roles.update);
  router.resources('roles', '/api/v1/roles', controller.roles);
  // 权限管理
  router.resources('rights', '/api/v1/rights/', controller.rights);
};
