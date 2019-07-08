/**
 * 简易的 fake 请求，仅用于演示
 */
import { CONFIG } from '@/CONFIG';
import { Resp } from '@/interface';
import { RESPONSE_CODE } from '@react-ssr/shared';

function ca(
  content: any = {},
  code: RESPONSE_CODE = RESPONSE_CODE.SUCCESS,
  message = 'success',
): Resp<any> {
  return {
    code,
    message,
    content,
  };
}

export const mock = {
  [CONFIG.services.unified_certification]: {
    'post /login': (data, headers) =>
      ca({ token: `this_is_a_fake_token_${data.account}_${data.password}` }),
    'get /info': (_, headers) => {
      if (!headers.Authorization) {
        return ca({}, RESPONSE_CODE.TOKEN_INVALID, 'Token invalid.');
      }
      return ca({
        username: headers.Authorization,
        email: `${headers.Authorization}@example.com`,
      });
    },
  },
  [CONFIG.services.customer]: {
    'get /customer/list': (params, headers) => {
      if (!headers.Authorization) {
        return ca({}, RESPONSE_CODE.TOKEN_INVALID, 'Token invalid.');
      }
      const { age = 0, createTime = null } = {
        age: 12,
        createTime: new Date(),
        ...params,
      };
      const startId = (Math.random() * 100).toFixed(0);
      return ca(
        Array(10)
          .fill(void 0)
          .map((__, i) => ({
            id: `${startId}-${i}`,
            name: `name-${startId}`,
            age: age + i,
            orderList: Array(3)
              .fill(void 0)
              .map((___, j) => ({
                id: `${startId}-${i}-${j}`,
                createTime: createTime.setDate((createTime.getDate() + j) % 28),
              })),
          })),
      );
    },
  },
};

export const fakeRequestRest = async (
  domain: string,
  options: {
    method?: 'GET' | 'POST';
    path: string;
    data?: any;
    headers?: any;
  },
) => {
  if (!CONFIG.isMock) {
    throw new Error('当前 mock 关闭');
  }
  const apis = mock[domain];
  const keys = Object.keys(apis || {});
  const { method, path, data, headers } = { method: 'GET', ...options };
  const key = keys.find(k => {
    const [m, p] = k.split(' ');
    return (
      m.toLocaleLowerCase() === method.toLocaleLowerCase() &&
      p.replace(/^\//, '') === path.replace(/^\//, '')
    );
  });

  if (key) {
    const api = apis[key];
    if (typeof api === 'function') {
      return api(data, headers);
    } else {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve(api);
        }, 500);
      });
    }
  } else {
    // not match
    throw new Error('Mock config not match');
  }
};
