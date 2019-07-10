import { generateLangPipe } from '@react-ssr/shared';

export const lang = {
  app: {
    title: 'title',
  },
  login: {
    login: 'Login',
  },
};

// 导出类型可用于辅助其他类型的字段校验以及使用提示
export type LANG_TYPE = typeof lang;

export const LANG_HELPER: LANG_TYPE = generateLangPipe();
