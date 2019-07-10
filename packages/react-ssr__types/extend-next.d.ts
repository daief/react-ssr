import { ApolloClient } from 'apollo-client';
import * as next from 'next';
import { DefaultQuery } from 'fastify';
import { NormalizedCacheObject } from 'apollo-cache-inmemory';
import { ComponentType, Component } from 'react';

declare module 'next' {
  interface NextPageContext<Q extends DefaultQuery = DefaultQuery> {
    client: ApolloClient<NormalizedCacheObject>;
  }

  interface NextComponentType<
    C extends BaseContext = NextPageContext,
    IP = {},
    P = {}
  > extends ComponentType<P> {
    Layout?: NextComponentType;
    getInitialProps?(context: C): IP | Promise<IP>;
  }
}
