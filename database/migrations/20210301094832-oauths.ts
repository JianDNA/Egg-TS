// import { QueryInterface } from 'sequelize';

module.exports = {
  // 在执行数据库升级时调用的函数，创建 users 表
  up: async (queryInterface, Sequelize) => {
    const { INTEGER, DATE, STRING } = Sequelize;
    await queryInterface.createTable('oAuths', {
      id: {
        type: INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      access_token: { // 保存授权之后的令牌
        type: STRING(255),
        allowNull: false,
      },
      provider: { // 保存是哪个平台授权的 QQ/Weixin/Webo/Github
        type: STRING(255),
        allowNull: false,
      },
      uid: { // 保存第三方平台返回的用户id
        type: INTEGER,
        allowNull: false,
        unique: true,
      },
      user_id: { // 本地绑定的用户id
        type: INTEGER,
        allowNull: false,
        unique:true,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      created_at: DATE,
      updated_at: DATE,
    });
  },
  // 在执行数据库降级时调用的函数，删除 users 表
  down: async queryInterface => {
    await queryInterface.removeColumn('users', 'github');
  },
};
