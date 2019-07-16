import { ApolloClient } from 'apollo-client';
import * as next from 'next';
import { DefaultQuery } from 'fastify';
import { NormalizedCacheObject } from 'apollo-cache-inmemory';
import { ComponentType, Component } from 'react';
import { BaseContext } from 'next-server/dist/lib/utils';

declare module 'next' {
  interface NextPageContext<Q extends DefaultQuery = DefaultQuery> {
    client: ApolloClient<NormalizedCacheObject>;
  }
}
