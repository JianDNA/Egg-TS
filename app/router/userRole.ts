module.exports = app => {
  app.router.post('/api/v1/userrole', app.controller.userRole.create);
  app.router.delete('/api/v1/userrole/:userId', app.controller.userRole.destroy);
};
