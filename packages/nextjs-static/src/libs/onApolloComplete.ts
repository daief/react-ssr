import { getProp, RESPONSE_CODE } from '@react-ssr/shared';
import { CONFIG } from '@react-ssr/shared/CONFIG';
import { message } from 'antd';
import { ApolloLink, Observable } from 'apollo-link';

export function onApolloComplete() {
  const toLogin = () => {
    const url = `${
      CONFIG.clientDomains.account
    }/auth/login?callback=${encodeURIComponent(location.href)}`;

    // token 失效，重定向回登录页
    if (process.browser) {
      location.replace(url);
    }
  };

  return new ApolloLink((operation, forward) => {
    const { autoToast = true } = operation.getContext();

    if (operation.operationName === 'logout') {
      toLogin();
      return forward(operation);
    }
    return new Observable(observer => {
      const sub = forward(operation).subscribe({
        next: result => {
          if (result.errors) {
            const respErrorInfo = result.errors.map(error => ({
              message: error.message + '',
              code: getProp(() => error.extensions.code),
            }));

            if (process.browser && autoToast) {
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
              toLogin();
              // 页面跳走了，提前结束
              observer.complete();
            }
          }

          observer.next(result);
        },
        error: error => {
          if (process.browser && autoToast) {
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
