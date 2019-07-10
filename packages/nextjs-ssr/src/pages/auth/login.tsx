import gql from '@/gqls/login.gql';
import { Button, Form, Input, Row } from 'antd';
import { LANG_HELPER } from 'locales/en';
import { NextComponentType } from 'next';
import * as React from 'react';
import { useMutation } from 'react-apollo-hooks';
import { useTranslation } from 'react-i18next';
import styles from './style.less';

export const Page: NextComponentType<{}> = props => {
  const { t } = useTranslation();
  const [doLogin, { loading }] = useMutation(gql.login);
  const handleSubmit = (e: React.FormEvent<HTMLElement>) => {
    e.preventDefault();
    doLogin({
      variables: {
        account: 'a',
        password: 'd',
      },
    });
  };
  return (
    <div className={`t-center ${styles.login}`}>
      <h1 style={{ marginBottom: 40 }}>
        <img className="login-icon" src={require('@/assets/gift.png')} alt="" />
        {t(LANG_HELPER.login.login.done)}
      </h1>

      <Form onSubmit={handleSubmit}>
        <Row className="form-field">
          <Form.Item>
            <Input size="large" />
          </Form.Item>
        </Row>
        <Row className="form-field">
          <Form.Item>
            <Input.Password size="large" />
          </Form.Item>
        </Row>
        <Row className="form-field">
          <Form.Item>
            <Button
              htmlType="submit"
              size="large"
              style={{ width: '100%' }}
              type="primary"
              loading={loading}
            >
              {t(LANG_HELPER.login.login.done)}
            </Button>
          </Form.Item>
        </Row>
      </Form>
    </div>
  );
};

export default Page;
