import gql from '@/gqls/page.gql';
import { FI } from '@axew/rc-if';
import { getProp, useQueryExtend } from '@react-ssr/shared';
import { Alert, Avatar, Card, Col, Divider, Row, Skeleton } from 'antd';
import { AuthLayout } from 'components/AuthLayout';
import { IUserInfoResp } from 'gql-types/authorization';
import { LANG_HELPER } from 'locales/en';
import { NextComponentType } from 'next';
import Link from 'next/link';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

export const Page: NextComponentType = () => {
  const { t } = useTranslation();
  const [_, { data, errorMessage, loading }] = useQueryExtend<{
    profile: {
      avatar_url: string;
      name: string;
      id: string;
      public_repos: number;
      html_url: string;
    };
    userInfo: IUserInfoResp;
  }>(gql.page);

  const profile = getProp(() => data.profile, {});
  const userInfo = getProp(() => data.userInfo.content, {});

  return (
    <div style={{ margin: 50 }}>
      <Link href="/">
        <a>{t(LANG_HELPER.page.backText.done)}</a>
      </Link>
      <Divider />
      <div>{t(LANG_HELPER.page.text.done)}</div>
      <Divider />
      <Skeleton loading={loading}>
        <FI>
          <FI.If if={!!data}>
            <div style={{ whiteSpace: 'pre-wrap' }}>
              <Row gutter={16}>
                <Col md={12} sm={24}>
                  <Card
                    title={'Github Profile'}
                    extra={
                      <a
                        href="https://api.github.com/users/daief"
                        target="_blank"
                      >
                        By rest api
                      </a>
                    }
                  >
                    <Card.Meta
                      avatar={
                        <a href={profile.html_url} target="_blank">
                          <Avatar src={profile.avatar_url} />
                        </a>
                      }
                      title={profile.name}
                      description={`public_repos: ${profile.public_repos}`}
                    />
                  </Card>
                </Col>
                <Col md={12} sm={24}>
                  <Card title="User info" extra="By gql-server">
                    <Card.Meta
                      title={userInfo.username}
                      description={userInfo.email}
                    />
                  </Card>
                </Col>
              </Row>
            </div>
          </FI.If>
          <FI.ElseIf elseIf={!!errorMessage}>
            <Alert type="error" message={errorMessage} />
          </FI.ElseIf>
        </FI>
      </Skeleton>
    </div>
  );
};

Page.Layout = AuthLayout;

export default Page;
