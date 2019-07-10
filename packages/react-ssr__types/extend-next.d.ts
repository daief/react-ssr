import { ApolloClient } from 'apollo-client';
import * as next from 'next';
import { DefaultQuery } from 'fastify';
import { NormalizedCacheObject } from 'apollo-cache-inmemory';

declare module 'next' {
  interface NextPageContext<Q extends DefaultQuery = DefaultQuery> {
    client: ApolloClient<NormalizedCacheObject>;
  }
  // interface NextStaticLifecycle<IP, C> {
  //   Layout?: NextComponentType<T>;
  // }
}
