import { InMemoryCache, NormalizedCacheObject } from 'apollo-cache-inmemory';
import ApolloClient from 'apollo-client';
import { ApolloLink } from 'apollo-link';
import { setContext } from 'apollo-link-context';
import { createHttpLink } from 'apollo-link-http';
import apolloLogger from 'apollo-link-logger';
import 'isomorphic-unfetch';
import { NextPageContext } from 'next';
import * as React from 'react';
import { ApolloProvider } from 'react-apollo';
import { ApolloProvider as ApolloHooksProvider } from 'react-apollo-hooks';
import { CONFIG } from '../../../CONFIG';
import { getProp } from '../../utils';

let apolloClient: ApolloClient<NormalizedCacheObject> | null = null;

export const ApolloContext = React.createContext<ApolloClient<any>>(null);

export const ApolloWrap: React.SFC<{
  client: ApolloClient<NormalizedCacheObject>;
}> = ({ client, children }) => {
  return (
    <ApolloProvider client={client}>
      <ApolloHooksProvider client={client}>
        <ApolloContext.Provider value={client}>
          {children}
        </ApolloContext.Provider>
      </ApolloHooksProvider>
    </ApolloProvider>
  );
};

export function getApollo(options: {
  links?: ApolloLink[];
  ctx?: NextPageContext;
  state?: {
    resolvers?: any;
    defaults?: any;
  };
}): ApolloClient<NormalizedCacheObject> {
  if (process.browser && apolloClient) {
    return apolloClient;
  }
  const { links = [], ctx, state } = options;

  const authLink = setContext((_, { headers }) => {
    // 这里用于添加自定义的 headers 字段
    const reqHeaders: any = !process.browser
      ? getProp(() => ctx.req.headers, {})
      : {};
    return {
      headers: {
        ...headers,
        ...reqHeaders,
      },
    };
  });

  const cache = new InMemoryCache();

  // 服务端每次生成新的 apollo client 对象
  apolloClient = new ApolloClient({
    cache,
    // connectToDevTools: process.browser,
    link: ApolloLink.from(
      [
        process.env.NODE_ENV === 'development' && process.browser
          ? apolloLogger
          : null,
        authLink,
        ...links,
        createHttpLink({
          credentials: 'include',
          headers: {},
          uri: `${CONFIG.clientDomains['gql-server']}/unified-certification`,
        }),
      ].filter(Boolean),
    ),
    ssrMode: !process.browser,
  });

  return apolloClient;
}
