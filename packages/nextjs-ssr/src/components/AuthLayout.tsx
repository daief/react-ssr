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
  await ctx.client
    .query<IUserInfoResp>({
      query: gql.info,
      fetchPolicy: 'network-only',
    })
    .catch(e => {
      if (
        getProp(() => e.graphQLErrors[0].extensions.code) ===
        RESPONSE_CODE.TOKEN_INVALID
      ) {
        const url = `${
          CONFIG.clientDomains.account
        }/auth/login?callback=${encodeURIComponent(
          process.browser ? location.href : ctx.req.url,
        )}`;

        // token 失效，重定向回登录页
        if (process.browser) {
          message.error(e.message);
          router.replace(url);
        } else {
          ctx.res.writeHead(302, {
            location: url,
          });
          ctx.res.end();
        }
      }
      return {};
    });
  return {};
};
