import gql from '@/gqls/auth.gql';
import { getProp, RESPONSE_CODE } from '@react-ssr/shared';
import { CONFIG } from '@react-ssr/shared/CONFIG';
import { message } from 'antd';
import { IUserInfoResp } from 'gql-types/authorization';
import { NextComponentType } from 'next';
import router from 'next/router';
import * as React from 'react';

export const AuthLayout: NextComponentType = ({ children }) => <>{children}</>;

AuthLayout.getInitialProps = async ctx => {
  // 每次调一次接口，本例中主要目的用来触发 token 校验
  // 还可以在这里请求路由权限，控制用户路由的访问
  // hasPermission = resp.permissions.includes(ctx.pathname)
  // return { hasPermission }
  ctx.client.query<IUserInfoResp>({
    query: gql.info,
    fetchPolicy: 'network-only',
  });
  return {};
};
