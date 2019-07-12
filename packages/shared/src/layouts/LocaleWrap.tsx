import { LocaleProvider } from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import moment from 'moment';

import i18n from 'i18next';
import * as React from 'react';
import {
  I18nextProvider as Provider,
  initReactI18next,
  useTranslation,
} from 'react-i18next';

import 'moment/locale/en-au';
import 'moment/locale/zh-cn';
import { LOCALE_ENUM, sharedI18next } from '../..';
import { Log } from '../Log';

/**
 * 国际化对象直接共用了
 */
export const i18nReact = i18n
  // 加载第三方国际化
  .use(sharedI18next)
  .use(initReactI18next);

/**
 * 覆盖 t 方法，nextjs-static 项目中使用
 * 将 Server 端的国际化输出全都设置成 `...`
 * 还可以考虑其他的方式，比如设置一种不存在的语言，同时设置不存在的翻译输出为 `...`
 */
export function rewriteT() {
  const originT = i18nReact.t;
  i18nReact.t = (...rest) => {
    const placeholder = '...';
    try {
      // server always return ...
      return process.browser ? originT.call(i18nReact, ...rest) : placeholder;
    } catch (_) {
      Log.Error('Translate error', _);
      return placeholder;
    }
  };
}

const OtherLocale: React.SFC = props => {
  // tslint:disable-next-line: no-shadowed-variable
  const { i18n } = useTranslation();
  const antdLocaleMap = {
    [LOCALE_ENUM.ZH_CH]: zhCN,
    [LOCALE_ENUM.EN_US]: enUS,
  };
  const [antdLocale, setAntdLocale] = React.useState(
    antdLocaleMap[i18n.language] || enUS,
  );

  React.useEffect(() => {
    moment.locale(
      {
        [LOCALE_ENUM.ZH_CH]: 'zh-cn',
        [LOCALE_ENUM.EN_US]: 'en-au',
      }[i18n.language] || 'en-au',
    );

    setAntdLocale(antdLocaleMap[i18n.language] || enUS);
  }, [i18n.language]);

  return <LocaleProvider locale={antdLocale}>{props.children}</LocaleProvider>;
};

export function I18nextProvider({ children }: React.PropsWithChildren<{}>) {
  return (
    <Provider i18n={i18nReact}>
      <OtherLocale>{children}</OtherLocale>
    </Provider>
  );
}
