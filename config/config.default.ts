import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';

export default (appInfo: EggAppInfo) => {
  const config = {} as PowerPartial<EggAppConfig>;

  // override config from framework / plugin
  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_vusn@qq1109632473.com';

  // 超时时间
  config.serverTimeout = 10000;
  // 跨域相关配置
  config.cors = {
    // 允许哪些地址可以跨域请求
    origin: 'http://127.0.0.1:8080',
    // 允许可以发送哪些跨域请求
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH,',
    // 下面这条加上才能共享跨域session，同时前端ajax请求也要加上响应的参数
    credentials: true,
  };

  // add your egg config in here
  config.middleware = [ 'auth' ];
  config.auth = {
    authUrls: [
      '/users',
    ],
  };

  // 文件上传
  config.multipart = {
    fileSize: '10mb',
    mode: 'file', // 文件模式 or 数据流模式    https://eggjs.org/en/basics/controller.html#stream-mode  文件模式: 先将前端的数据写入到缓存中,然后返回给我们(简单但性能差)  数据流模式: 复杂且高性能
  };

  // add your special config in here
  const bizConfig = {
    sourceUrl: `https://github.com/eggjs/examples/tree/master/${appInfo.name}`,
  };
  // the return config will combines to EggAppConfig
  return {
    ...config,
    ...bizConfig,
  };
};
