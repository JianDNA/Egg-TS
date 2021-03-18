import { AutoIncrement, Column, AllowNull, Unique, DataType, Model, PrimaryKey, Table, CreatedAt, UpdatedAt, HasMany, BelongsToMany } from 'sequelize-typescript';
import { OAuth } from './oauth';
import { Role } from './role';
import { UserRole } from './userRole';
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

  @Column({
    field: 'user_state',
    type: DataType.BOOLEAN,
    allowNull: true,
    unique: false,
    defaultValue: true,
  })
  userState: boolean;

  @Column({
    field: 'avatar_url',
    type: DataType.STRING,
    allowNull: true,
    unique: false,
    defaultValue: '/public/avatar.png',
    comment: '用户头像',
    // 获取器
    // get() {
    //   const rawValue = this.getDataValue('avatarURL');
    //   return rawValue ? 'http://127.0.0.1:7001' + rawValue : null;
    // },
  })
  avatarURL: string;

  @Column({
    type: DataType.VIRTUAL,
    get() {
      return 'http://127.0.0.1:7001';
    },
    // set() {
    //   throw new Error('不要尝试设置 `fullName` 的值!');
    // },
  })
  baseURL: string;

  @HasMany(() => OAuth)
  oauths:OAuth[];

  @BelongsToMany(() => Role, () => UserRole)
  roles:Role[];

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}


export default () => User;
