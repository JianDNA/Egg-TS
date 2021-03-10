export default {
  email: {
    required: false,
    type: 'string',
    format: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
    trim: true,
    message: '邮箱校验不符合要求',
  },
  username: {
    required: false,
    type: 'string',
    trim: true,
    format: /^[a-zA-Z0-9]{6,}$/,
    message: '用户名不符合要求',
  },
  password: {
    required: false,
    type: 'string',
    trim: true,
    // 至少包含数字跟字母，可以有字符
    format: /(?=.*([a-zA-Z].*))(?=.*[0-9].*)[a-zA-Z0-9-*/+.~!@#$%^&*()]{8,20}$/,
    message: '密码不符合要求',
  },
  phone: {
    required: false,
    type: 'string',
    format: /^1[3456789]\d{9}/,
    trim: true,
    message: '手机校验不符合要求',
  },
};
