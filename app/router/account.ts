// 用户登录注册
module.exports = app => {
  app.router.post('/register', app.controller.user.create);
  app.router.post('/login', app.controller.user.index);
  app.router.get('/isLogin', app.controller.user.isLogin);

  // router.get('/githubAuth', controller.github.getLoginView);
  // router.get('/github/callback', controller.github.getAccessToken);
  //  上面两句等价于下面三句
  const github = (app as any).passport.authenticate('github', {
    successRedirect: 'http://127.0.0.1:8080/admin',
  });

  app.router.get('/passport/github', github);
  app.router.get('/passport/github/callback', github);
};
