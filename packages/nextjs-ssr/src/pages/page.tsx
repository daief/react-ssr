import { Divider } from 'antd';
import { AuthLayout } from 'components/AuthLayout';
import { LANG_HELPER } from 'locales/en';
import { NextPage } from 'next';
import Link from 'next/link';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

export const Page: NextPage = () => {
  const { t } = useTranslation();
  return (
    <div>
      <Link href="/">
        <a>{t(LANG_HELPER.page.backText.done)}</a>
      </Link>
      <Divider />
      <div>{t(LANG_HELPER.page.text.done)}</div>
    </div>
  );
};
// @ts-ignore
Page.Layout = AuthLayout;

export default Page;
