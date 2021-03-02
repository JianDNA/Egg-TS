import { QueryInterface } from 'sequelize';

// 创建用户表
// ts文件需要自定义脚本执行ts文件
// https://blog.csdn.net/taokexia/article/details/105556703
// "sequelize-cli-ts: "node -r ts-node/register ./node_modules/sequelize-cli/lib/sequelize"
// 执行方式: npm run sequelize-cli-ts db:migrate
module.exports = {
  // 在执行数据库升级时调用的函数，创建 users 表
  up: async (queryInterface: QueryInterface, Sequelize) => {
    const { INTEGER, DATE, STRING } = Sequelize;
    await queryInterface.createTable('users', {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true },
      username: {
        type: STRING(255),
        allowNull: true,
        unique: true,
      },
      email: {
        type: STRING(255),
        allowNull: true,
        unique: true,
      },
      phone: {
        type: STRING(255),
        allowNull: true,
        unique: true,
      },
      password: {
        type: STRING(255),
        allowNull: false,
        unique: false,
      },
      created_at: DATE,
      updated_at: DATE,
    });
  },
  // 在执行数据库降级时调用的函数，删除 users 表
  down: async (queryInterface : QueryInterface) => {
    await queryInterface.dropTable('users');
  },
};
