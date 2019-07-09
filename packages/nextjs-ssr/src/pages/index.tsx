import { SeleceLang } from '@react-ssr/shared/compts';
import { Button } from 'antd';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

export default () => {
  const { t } = useTranslation();
  return (
    <div>
      home-{t('app:title')}
      <Button>ddd</Button>
      <div style={{ padding: 30 }}>
        <SeleceLang />
      </div>
    </div>
  );
};
