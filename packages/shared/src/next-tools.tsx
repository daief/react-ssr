import * as cookies from 'browser-cookies';
import { IncomingMessage } from 'http';
import { NextComponentType } from 'next';
import { CONFIG } from '../CONFIG';
import { LOCALE_ENUM } from './LOCALE';
import { Log } from './Log';

export async function getInitialPropsResultOfComponent(
  c: NextComponentType,
  ctx: any,
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
