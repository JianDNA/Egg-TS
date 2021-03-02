// 验证码
module.exports = app => {
  app.router.get('/imageCode', app.controller.util.imageCode);
  app.router.get('/emailCode', app.controller.util.emailCode);
  app.router.get('/smsCode', app.controller.util.smsCode);
};
