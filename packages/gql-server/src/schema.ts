import { LOCALE_ENUM } from '@react-ssr/shared';
import { ApolloServer } from 'apollo-server-fastify';
import { GraphQLSchema } from 'graphql';
import { CONFIG } from './CONFIG';
import { RESTService } from './dataSource/RESTService';

export function createApollo(config: { schema: GraphQLSchema; path: string }) {
  const { schema, path } = config;

  const server = new ApolloServer({
    schema,
    dataSources: () => ({
      // 对应多个后端服务
      unifiedCertificationService: new RESTService({
        baseurl: CONFIG.services.unified_certification,
        // 每个应用在请求时还需要携带对应的应用信息
        headers: new Map([
          ['clientKey', CONFIG.clientKeys.unified_certification],
        ]),
      }),
      customerService: new RESTService({
        baseurl: CONFIG.services.customer,
        headers: new Map([['clientKey', CONFIG.clientKeys.customer]]),
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
        req: ctx.req,
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
