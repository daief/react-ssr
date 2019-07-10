import * as cookies from 'browser-cookies';
import { IncomingMessage } from 'http';
import { NextComponentType, NextPageContext } from 'next';
import { CONFIG } from '../CONFIG';
import { LOCALE_ENUM } from './LOCALE';
import { Log } from './Log';

export async function getInitialPropsResultOfComponent(
  c: NextComponentType,
  ctx: NextPageContext,
) {
  if (c && c.getInitialProps) {
    try {
      return await c.getInitialProps(ctx);
    } catch (error) {
      Log.Error('error getInitialPropsResultOfComponent', error);
      return {};
    }
  }
  return {};
}

/**
 * 从 cookie 中获取国际化信息
 * @param localeKey
 * @param req
 */
export function lngFromReq(req?: IncomingMessage) {
  if (req) {
    const cookieValue =
      (req.headers.cookie || '')
        .split(';')
        .map(val => (val || '').trim())
        .find(val => val.startsWith(CONFIG.cookieKeys.lng)) || '';
    return cookieValue.split('=')[1] || LOCALE_ENUM.EN_US;
  } else {
    return cookies.get(CONFIG.cookieKeys.lng)! || LOCALE_ENUM.EN_US;
  }
}

/**
 *
 * @param opts
 * @example
 *    const L = generateLangPipe()
 *    L.a.b.c.done; // 'a:b.c'
 */
export function generateLangPipe(
  opts: {
    endpoint?: string;
    separator?: string;
  } = {},
) {
  const defaultSeparator = '.';
  const { endpoint = 'done', separator = defaultSeparator } = opts;
  let propNameStack = [];
  const proxy = new Proxy(
    {},
    {
      get(_, propName) {
        if (propName === endpoint) {
          const result = propNameStack.join(separator);
          propNameStack = [];
          return result.replace(/^[^\.]+(\.)[^\.]+/, (str, $1) =>
            str.replace($1, ':'),
          );
        }
        propNameStack.push(propName);
        return proxy;
      },
    },
  );

  return proxy;
}
