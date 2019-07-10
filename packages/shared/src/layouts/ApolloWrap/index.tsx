import { InMemoryCache, NormalizedCacheObject } from 'apollo-cache-inmemory';
import ApolloClient from 'apollo-client';
import { ApolloLink } from 'apollo-link';
import { createHttpLink } from 'apollo-link-http';
import apolloLogger from 'apollo-link-logger';
import 'isomorphic-unfetch';
import { NextPageContext } from 'next';
import * as React from 'react';
import { ApolloProvider } from 'react-apollo';
import { ApolloProvider as ApolloHooksProvider } from 'react-apollo-hooks';
import { CONFIG } from '../../../CONFIG';

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
}): ApolloClient<NormalizedCacheObject> {
  if (process.browser && apolloClient) {
    return apolloClient;
  }
  const { links = [], ctx } = options;

  // const authLink = setContext((_, { headers }) => {
  //   const { host: __, ...rest } = (!process.browser && getHeaders
  //     ? getHeaders()
  //     : {}) as any;
  //   return {
  //     headers: {
  //       ...headers,
  //       ...rest,
  //     },
  //   };
  // });

  // 服务端每次生成新的 apollo client 对象
  apolloClient = new ApolloClient({
    cache: new InMemoryCache(),
    // connectToDevTools: process.browser,
    link: ApolloLink.from(
      [
        process.env.NODE_ENV === 'development' && process.browser
          ? apolloLogger
          : null,
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
