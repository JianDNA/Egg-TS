module.exports = app => {
  app.router.get('/api/v1/users', app.controller.users.index);
  app.router.post('/api/v1/users', app.controller.users.create);
  app.router.delete('/api/v1/users/:id', app.controller.users.delete);
  app.router.put('/api/v1/users/:id', app.controller.users.update);
  app.router.post('/api/v1/posts/', app.controller.users.posts);
  app.router.post('/api/v1/importUser', app.controller.users.importUser);
  app.router.get('/api/v1/exportUser', app.controller.users.exportUser);
};
