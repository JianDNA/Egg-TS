import { EggPlugin } from 'egg';

const plugin: EggPlugin = {
  // static: true,
  // nunjucks: {
  //   enable: true,
  //   package: 'egg-view-nunjucks',
  // },
  // 开启sequelize
  sequelize: {
    enable: true,
    // package: 'egg-sequelize',
    package: 'egg-sequelize-type',
  },
  // 开启前端数据校验
  validate: {
    enable: true,
    package: 'egg-validate',
  },
  // 开启redis存储
  sessionRedis: {
    enable: true,
    package: 'egg-session-redis',
  },
  redis: {
    enable: true,
    package: 'egg-redis',
  },
  // 开启跨域
  cors: {
    enable: true,
    package: 'egg-cors',
  },
};

export default plugin;
