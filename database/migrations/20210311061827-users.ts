
// 为users表新增字段
module.exports = {
  // 在执行数据库升级时调用的函数，创建 users 表
  up: async (queryInterface, Sequelize) => {
    const { BOOLEAN } = Sequelize;
    await queryInterface.addColumn('users', 'local', {
      type: BOOLEAN,
      allowNull: true,
      unique: false,
      defaultValue: true,
    });
  },
  // 在执行数据库降级时调用的函数，删除 users 表
  down: async queryInterface => {
    await queryInterface.removeColumn('users', 'local');
  },
};
