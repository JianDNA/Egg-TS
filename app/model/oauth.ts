/*
module.exports = app => {
  const { STRING, INTEGER, DATE } = app.Sequelize;

  const User = app.model.define('user', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    name: STRING(30),
    age: INTEGER,
    created_at: DATE,
    updated_at: DATE,
  });

  return User;
};
*/
// app/model/user.js

/**
 * @desc 用户表
 */
import { AutoIncrement, Column, DataType, Model, PrimaryKey, Table, CreatedAt, UpdatedAt, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from './user';

@Table({
  modelName: 'oauth',
})
export class Oauth extends Model {
  [x: string]: any;

  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
    unique: true,
    allowNull: false,
  })
  id: number;

  @Column({
    field: 'access_token',
    type: DataType.STRING(255),
    allowNull: true,
    comment: '令牌',
  })
  accessToken: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
    comment: '平台',
  })
  provider: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    unique: true,
    comment: '第三方平台返回的用户id',
  })
  uid: number;


  @ForeignKey(() => User)
  @Column({
    field: 'user_id',
    type: DataType.INTEGER,
    allowNull: false,
    unique: true,
    comment: '本地绑定的用户id',
  })
  userId: number;

  @BelongsTo(() => User)
  user: User;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  // @Column({
  //   field: 'created_at',
  // });

}
export default () => Oauth;
