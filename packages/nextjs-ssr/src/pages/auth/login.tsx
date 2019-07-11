import gql from '@/gqls/auth.gql';
import { FI } from '@axew/rc-if';
import {
  requiredRule,
  RESPONSE_CODE,
  useMutationExtend,
} from '@react-ssr/shared';
import { Alert, Button, Form, Icon, Input, Row } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { ILoginResultResp } from 'gql-types/authorization';
import { LANG_HELPER } from 'locales/en';
import { WithRouterProps } from 'next/dist/client/with-router';
import Router, { withRouter } from 'next/router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './style.less';

export const Page: React.SFC<FormComponentProps & WithRouterProps> = ({
  form,
  router,
}) => {
  const { t } = useTranslation();
  const [doLogin, { loading, errorMessage }] = useMutationExtend<{
    login: ILoginResultResp;
  }>(gql.login, {
    context: {
      autoToast: false,
    },
  });
  const callbackURL = router.query.callback as string;

  const handleSubmit = (e: React.FormEvent<HTMLElement>) => {
    e.preventDefault();
    form.validateFields((err, vals) => {
      if (err) {
        return;
      }
      doLogin({
        variables: {
          ...vals,
        },
      })
        .then(resp => {
          if (resp.data.login.code === RESPONSE_CODE.SUCCESS) {
            if (callbackURL) {
              location.href = callbackURL;
            } else {
              Router.push('/');
            }
          }
        })
        .catch(() => {
          // 网络错误、非成功 code、各种错误进入 catch
        });
    });
  };

  return (
    <div className={`t-center ${styles.login}`}>
      <h1 style={{ marginBottom: 40 }}>
        <img className="login-icon" src={require('@/assets/gift.png')} alt="" />
        {t(LANG_HELPER.login.login.done)}
      </h1>

      <Form onSubmit={handleSubmit} className="t-left">
        <div style={{ height: 70 }}>
          <FI show={!!errorMessage}>
            <Alert
              className="form-field"
              type="error"
              message={errorMessage}
              showIcon
            />
          </FI>
        </div>
        <Row className="form-field">
          <Form.Item>
            {form.getFieldDecorator('account', {
              rules: [requiredRule(t, t(LANG_HELPER.login.account.done))],
            })(
              <Input
                size="large"
                prefix={<Icon type="user" />}
                placeholder={t(LANG_HELPER.common.please_enter.done, {
                  field: t(LANG_HELPER.login.account.done),
                })}
              />,
            )}
          </Form.Item>
        </Row>
        <Row className="form-field">
          <Form.Item>
            {form.getFieldDecorator('password', {
              rules: [requiredRule(t, t(LANG_HELPER.login.password.done))],
            })(
              <Input.Password
                size="large"
                prefix={<Icon type="lock" />}
                placeholder={t(LANG_HELPER.common.please_enter.done, {
                  field: t(LANG_HELPER.login.password.done),
                })}
              />,
            )}
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

export default Form.create()(withRouter(Page));
