import i18next from 'i18next';
// import merge from 'lodash/merge'

import en from './en';
import zh from './zh';

export enum LOCALE_ENUM {
  ZH_CH = 'zh-CN',
  EN_US = 'en-US',
}

export const sharedI18next = {
  type: '3rdParty',
  init(instance: { store: i18next.i18n }) {
    Object.keys(en).forEach(ns => {
      instance.store.addResourceBundle(LOCALE_ENUM.EN_US, ns, en[ns]);
    });
    Object.keys(zh).forEach(ns => {
      instance.store.addResourceBundle(LOCALE_ENUM.ZH_CH, ns, zh[ns]);
    });
  },
};
