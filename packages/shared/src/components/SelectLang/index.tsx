import { Dropdown, Icon, Menu } from 'antd';
// import 'antd/lib/dropdown/style';
// import 'antd/lib/icon/style';
// import 'antd/lib/menu/style';
import * as cookies from 'browser-cookies';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { CONFIG } from '../../../CONFIG';
import { LOCALE_ENUM } from '../../LOCALE';
import styles from './index.less';

export const SeleceLang: React.SFC<{
  className?: string;
}> = ({ className }) => {
  function setLocale(lang: LOCALE_ENUM) {
    if (lang !== undefined && !/^([a-z]{2})-([A-Z]{2})$/.test(lang)) {
      throw new Error('setLocale lang format error');
    }
    cookies.set(CONFIG.cookieKeys.lng, lang, { expires: 365 });
    i18n.changeLanguage(lang);
  }

  const { t, i18n } = useTranslation();
  const locales = [LOCALE_ENUM.ZH_CH, LOCALE_ENUM.EN_US];
  const languageLabels = {
    [LOCALE_ENUM.ZH_CH]: '简体中文',
    [LOCALE_ENUM.EN_US]: 'English',
  };
  const languageIcons = {
    [LOCALE_ENUM.ZH_CH]: '🇨🇳',
    [LOCALE_ENUM.EN_US]: '🇬🇧',
  };

  const langMenu = (
    <Menu
      className={styles.menu}
      selectedKeys={[i18n.language]}
      onClick={({ key }) => {
        setLocale(key as LOCALE_ENUM);
      }}
    >
      {locales.map(locale => (
        <Menu.Item key={locale}>
          <span role="img" aria-label={languageLabels[locale]}>
            {languageIcons[locale]}
          </span>
          {languageLabels[locale]}
        </Menu.Item>
      ))}
    </Menu>
  );

  return (
    <Dropdown overlay={langMenu}>
      <span className={`${styles.dropDown} ${className}`}>
        <Icon type="global" title={t('common:select_lang')} />
      </span>
    </Dropdown>
  );
};
