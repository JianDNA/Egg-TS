const jwt = require('jsonwebtoken');

const getActionRights = ctx => {
  const userInfo = ctx.session.user;
  if (!userInfo) return null;
  // eslint-disable-next-line array-callback-return
  const actionRights = userInfo.rightsTree.filter((rights: any) => {
    if (rights.rightsType === 'action') return rights;
  });
  return actionRights[0];
};
const isRequest = (actionRights: any, path: string, method: string) => {
  const reg = new RegExp(`^${actionRights.rightsPath}(/[0-9]*)?$`, 'i');
  if (reg.test(path) && actionRights.rightsMethod === method) return true;
  if (actionRights.children) {
    for (let i = 0; i < actionRights.children.length; i++) {
      const item = actionRights.children[i];
      if (isRequest(item, path, method)) return true;
    }
  }
  return false;
};

let actionRights;
/**
 * @param _options config中给中间件传递的对象
 * @param app
 */
module.exports = (_options, app) => {
  return async function(ctx, next) {
    // 存储: /api/v1/users
    // 传来: /api/v1/users?page=1&pageSize=5
    let curPath = ctx.url.toLowerCase();
    const curMethod = ctx.request.method.toLowerCase();
    if (!curPath.startsWith('/api/v1')) {
      await next();
      return;
    }
    actionRights = getActionRights(ctx);
    if (!actionRights) {
      ctx.error(400, '没有权限');
      return;
    }
    const idx = curPath.indexOf('?');
    if (idx !== -1) {
      curPath = curPath.substr(0, idx);
    }
    const flag = isRequest(actionRights, curPath, curMethod);
    if (flag) {
      // 3.获取客户端传递过来的JWT令牌
      // const token = ctx.get('authorization');
      // 注意点: 如果设置的时候知道不签名, 那么获取的时候也要指定不签名
      const token = ctx.cookies.get('token', { signed: false });
      // 4.判断客户端有没有传递jwt令牌
      if (token) {
        try {
          await jwt.verify(token, app.config.keys);
          await next();
        } catch (e) {
          ctx.error(401, '没有权限');
        }
      } else {
        ctx.error(401, '没有权限');
      }
    } else {
      ctx.error(400, '没有权限');
    }
    /*
    // 1.获取需要控制权限的路由地址
    const authUrls = options.authUrls;
    // 2.判断当前请求的路由地址是否需要权限控制
    if (authUrls.includes(ctx.url)) {
      // 需要权限控制
      // 3.获取客户端传递过来的JWT令牌
      // const token = ctx.get('authorization');
      // 注意点: 如果设置的时候知道不签名, 那么获取的时候也要指定不签名
      const token = ctx.cookies.get('token', { signed: false });
      // 4.判断客户端有没有传递jwt令牌
      if (token) {
        try {
          await jwt.verify(token, app.config.keys);
          await next();
        } catch (e) {
          ctx.error(401, '没有权限');
        }
      } else {
        ctx.error(401, '没有权限');
      }
    } else {
      // 不需要权限控制
      await next();
    }*/
  };

};
