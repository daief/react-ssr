import { LOCALE_ENUM } from '@react-ssr/shared';
import { ApolloServer } from 'apollo-server-fastify';
import { GraphQLSchema } from 'graphql';
import { CONFIG } from './CONFIG';
import { RESTService } from './dataSource/RESTService';

export function createApollo(config: { schema: GraphQLSchema; path: string }) {
  const { schema, path } = config;
  // 每个应用在请求时还需要携带对应的应用信息
  // 中间层默认携带授权中心的 key
  const headersMap = new Map([
    ['clientKey', CONFIG.clientKeys.unified_certification],
  ]);

  const server = new ApolloServer({
    schema,
    dataSources: () => ({
      unifiedCertificationService: new RESTService({
        baseurl: CONFIG.services.unified_certification,
        headers: headersMap,
      }),
    }),
    // 这里会被注入到 Rsolver 的 context 中
    context(ctx) {
      return {
        env: process.env.NODE_ENV,
        lng: ctx.cookies[CONFIG.cookieKeys.lng] || LOCALE_ENUM.EN_US,
        token:
          ctx.cookies[CONFIG.cookieKeys.token] ||
          ctx.req.headers.authorization ||
          '',
        // 此处将 token 信息暂存于自定义属性 session 上
        // fastifyApp onSend 的时候会根据情况写 cookie
        setToken(session: { token: string; deleted?: boolean }) {
          ctx.req.session = session;
        },
      };
    },
  });

  return server.createHandler({
    disableHealthCheck: true,
    path,
    cors: {
      origin: true,
      credentials: true,
      maxAge: 86400,
      methods: ['POST'],
    },
  });
}
