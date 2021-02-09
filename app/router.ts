import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router } = app;
  // 自定义校验规则
  // app.validator.addRule('myUserName', (_rule, value: string) => {
  //   if (value.length < 6) return '用户名至少是6位';
  // });
  router.get('/', controller.home.index);
  router.post('/register', controller.user.create);
};
