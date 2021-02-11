import { EggAppConfig, PowerPartial } from 'egg';

export default () => {
  const config: PowerPartial<EggAppConfig> = {};

  // 添加sequelize配置
  config.sequelize = {
    dialect: 'mysql',
    host: '127.0.0.1',
    username: 'root',
    password: 'root',
    port: 3306,
    database: 'eggts2',
    timezone: '+08:00',
  };

  // redis相关配置
  config.redis = {
    client: {
      host: '127.0.0.1',
      port: 6379,
      password: '',
      db: 0,
    },
  };
  // 邮箱相关配置
  config.smtp = {
    host: 'smtp.qq.com',
    port: 465,
    user: '2210021@qq.com', // generated ethereal user
    pass: 'plodbybvogirbgbf', // generated ethereal password
  };
  // 短信相关配置
  config.sms = {
    accessKeyId: 'LTAI4G6zd3rUJuXRXuyLbLdW',
    secretAccessKey: 'DgAjhWEJTQ1w48lyDXs4VLkmXwkrj5',
  };
  // 禁用CSRF安全校验
  config.security = {
    csrf: {
      enable: false,
    },
  };
  return config;
};
