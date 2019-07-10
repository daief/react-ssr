// 简单用于存储一些全局配置
export const CONFIG = {
  mainDomain: '.example.com',

  cookieKeys: {
    token: 'gql-token',
    lng: 'gql-lang',
  },

  // 应用的 key 标识
  clientKeys: {
    unified_certification: 'unified_certification',
    customer: 'key_customer',
  },

  // 应用域名
  clientDomains: {
    'gql-server': 'http://gql-server.example.com',
    account: 'http://account.example.com',
    customer: 'http://customer.example.com',
  },

  // 存在多个应用
  services: {
    unified_certification: 'http://unified-certification.service.com',
    customer: 'http://customer.service.com',
  },

  // 请求是否 mock
  isMock: true,
};
