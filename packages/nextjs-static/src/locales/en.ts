import { generateLangPipe } from '@react-ssr/shared';

export const lang = {
  app: {
    title: 'title',
  },
  login: {
    login: 'Login',
    account: 'Account',
    password: 'Password',
  },
  index: {
    userInfo: 'User Info',
    username: 'Username',
    email: 'Email',
    tip:
      'This is rendered by Next.js server. Click button to send query at browser with some params.',
    submit: 'Submit',
    logout: 'Logout',
    toPageText: 'Browser router, click to `/page`',
    customerList: 'Customer List',
    orderList: 'Order List',
  },
  page: {
    backText: 'Back to index `/`',
    text: 'Here is `/page`',
  },
  table: {
    id: 'ID',
    name: 'Name',
    age: 'Age',
    createTime: 'Create Time',
  },
  common: {
    please_enter: 'Please enter {{field}}',
  },
};

// 导出类型可用于辅助其他类型的字段校验以及使用提示
export type LANG_TYPE = typeof lang;

export const LANG_HELPER: LANG_TYPE = generateLangPipe();
