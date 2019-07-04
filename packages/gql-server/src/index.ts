import { Log } from '@react-ssr/shared';
import fastify from 'fastify';
import fastifyCookie from 'fastify-cookie';
import fastifyCookieCors from 'fastify-cors';
import 'reflect-metadata';
import { buildSchema } from 'type-graphql';
import { CONFIG } from './CONFIG';
import { createApollo } from './schema';

function fastifyApollo(configuration: { cookieName: string }) {
  const fastifyApp = fastify({
    pluginTimeout: 900000,
    logger: { level: 'error' },
  });

  fastifyApp.register(fastifyCookieCors, {
    origin: true,
    credentials: true,
    maxAge: 86400,
    methods: ['POST'],
  });

  fastifyApp.register(fastifyCookie);

  // 写 cookie token
  fastifyApp.addHook('onSend', (ctx, reply, payload, next) => {
    // @ts-ignore 读取自定义的 token 信息
    const session = ctx.req.session;
    if (!session) {
      next();
      return;
    } else if (session.deleted) {
      reply.setCookie(CONFIG.cookieKeys.token, '', {
        expires: new Date(0),
        maxAge: 0,
      });
      next();
      return;
    }
    reply.setCookie(CONFIG.cookieKeys.token, session.token, {
      path: '/',
      expires: new Date(Date.now() + 3600 * 24 * 365 * 1000),
      httpOnly: true,
      domain: CONFIG.mainDomain,
    });
    next();
  });

  return fastifyApp;
}

async function main() {
  const fastifyApp = fastifyApollo({
    cookieName: CONFIG.cookieKeys.token,
  });

  function importAll(r: any) {
    return r.keys().map(key => r(key));
  }

  const unifiedCertificationSchema = await buildSchema({
    resolvers: importAll(
      // @ts-ignore
      require.context('./resolvers/unifiedCertification', true, /.*ts$/),
    ),
    validate: false,
    dateScalarMode: 'timestamp',
  }).catch(e => {
    Log.Error('buildSchema 失败', e);
    throw new Error();
  });

  fastifyApp.register(
    createApollo({
      schema: unifiedCertificationSchema,
      path: '/unified-certification',
    }),
  );

  fastifyApp.listen(+(process.env.PORT || '4010'), '0.0.0.0', (err, url) => {
    if (err) {
      process.stdout.write(`${err.message} \n`);
      throw err;
    }
    process.stdout.write(`🚀  Server ready at: ${url}\n`);
  });
}

// start
main();
