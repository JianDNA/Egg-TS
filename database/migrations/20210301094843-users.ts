
// import { QueryInterface } from 'sequelize';

// 为users表新增字段
module.exports = {
  // 在执行数据库升级时调用的函数，创建 users 表
  up: async (queryInterface, Sequelize) => {
    const { INTEGER } = Sequelize;
    await queryInterface.addColumn('users', 'github', {
      type: INTEGER,
      allowNull: true,
      unique: false,
      defaultValue: 0, // 如果是0表示没有绑定第三方账户, 如果取值是1表示绑定了第三方账户
    });
  },
  // 在执行数据库降级时调用的函数，删除 users 表
  down: async queryInterface => {
    await queryInterface.removeColumn('users', 'github');
  },
};
