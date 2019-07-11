import gql from '@/gqls/auth.gql';
import { useQueryExtend } from '@react-ssr/shared';
import { NextComponentType } from 'next';
import * as React from 'react';

export const AuthLayout: NextComponentType = ({ children }) => {
  useQueryExtend(gql.info, {
    fetchPolicy: 'network-only',
  });
  return <>{children}</>;
};

// 不写这个上面类型要报错 =_=
AuthLayout.getInitialProps = void 0;
