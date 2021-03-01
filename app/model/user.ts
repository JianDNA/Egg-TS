import { AutoIncrement, Column, AllowNull, Unique, DataType, Model, PrimaryKey, Table, CreatedAt, UpdatedAt } from 'sequelize-typescript';
@Table({
  modelName: 'user',
})
export class User extends Model {
  @PrimaryKey
  @AutoIncrement
  @Unique
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    comment: '用户ID',
  })
  id: number;

  @AllowNull
  @Unique
  @Column({
    type: DataType.STRING(255),
    comment: '用户姓名',
    validate: {
      is: /^[A-Za-z0-9\-]{6,}$/,
    },
  })
  username: string;

  @AllowNull
  @Unique
  @Column({
    type: DataType.STRING(255),
    comment: '用户邮箱',
    validate: {
      isEmail: true,
    },
  })
  email: string;

  @AllowNull
  @Unique
  @Column({
    type: DataType.STRING(255),
    comment: '用户手机',
    validate: {
      is: /^1[3456789]\d{9}/,
    },
  })
  phone: string;


  @Column({
    type: DataType.STRING(255),
    comment: '用户密码',
    allowNull: false,
  })
  password: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
    unique: false,
    defaultValue: false, // 如果是0表示没有绑定第三方账户, 如果取值是1表示绑定了第三方账户
  })
  github: boolean;


  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}


export default () => User;
