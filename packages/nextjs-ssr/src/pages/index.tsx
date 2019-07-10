import { Button } from 'antd';
import { AuthLayout } from 'components/AuthLayout';
import { NextComponentType } from 'next';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

const Page: NextComponentType = () => {
  const { t } = useTranslation();
  return (
    <div>
      home-{t('app:title')}
      <Button>ddd</Button>
      <div style={{ padding: 30 }} />
    </div>
  );
};

/**
 * 设置 Layout，则该页面会在进入时进行 token 校验
 */
Page.Layout = AuthLayout;

export default Page;
