import { getProp, RESPONSE_CODE } from '@react-ssr/shared';
import { CONFIG } from '@react-ssr/shared/CONFIG';
import { message } from 'antd';
import { ApolloLink, Observable } from 'apollo-link';
import { NextPageContext } from 'next';

export function onApolloComplete({ ctx }: { ctx?: NextPageContext } = {}) {
  return new ApolloLink((operation, forward) => {
    // 这里可以看作是 apollo 请求的拦截器
    // 下面的主要自动进行了错误提示已经登录状态校验
    // 另外，可以在发起每一次的请求时，将配置项 options 传入 context，这样在这里可以通过 getContext 拿到
    //    比如控制某个请求不弹错误提示......
    // const { options } = operation.getContext()
    return new Observable(observer => {
      const sub = forward(operation).subscribe({
        next: result => {
          if (result.errors) {
            const respErrorInfo = result.errors.map(error => ({
              message: error.message + '',
              code: getProp(() => error.extensions.code),
            }));

            if (process.browser) {
              message.error(
                getProp(
                  () =>
                    // tslint:disable-next-line: no-shadowed-variable
                    respErrorInfo.filter(({ message }) => !!message)[0].message,
                ) || 'Server Error!',
              );
            }

            // 默认每一次 token 失效的请求都进行重定向登录页
            if (
              respErrorInfo.find(
                ({ code }) => code === RESPONSE_CODE.TOKEN_INVALID,
              )
            ) {
              const url = `${
                CONFIG.clientDomains.account
              }/auth/login?callback=${encodeURIComponent(
                process.browser ? location.href : ctx.req.url,
              )}`;

              // token 失效，重定向回登录页
              if (process.browser) {
                location.replace(url);
              } else {
                ctx.res.writeHead(302, {
                  location: url,
                });
                ctx.res.end();
              }

              // 页面跳走了，提前结束
              observer.complete();
            }
          }

          observer.next(result);
        },
        error: error => {
          if (process.browser) {
            message.error(error + '' || 'System Error!');
          }
          observer.error(error);
        },
        complete: () => {
          observer.complete();
        },
      });

      return () => {
        if (sub) {
          sub.unsubscribe();
        }
      };
    });
  });
}
