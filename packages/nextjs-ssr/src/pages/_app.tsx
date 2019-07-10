import styles from '@/global.less';
import { lang as en } from '@/locales/en';
import { lang as zh } from '@/locales/zh';
import {
  getInitialPropsResultOfComponent,
  lngFromReq,
  LOCALE_ENUM,
} from '@react-ssr/shared';
import {
  ApolloWrap,
  getApollo,
  I18nextProvider,
  i18nReact,
  SeleceLang,
} from '@react-ssr/shared/compts';
import { Log } from '@react-ssr/shared/src/Log';
import { NormalizedCacheObject } from 'apollo-cache-inmemory';
import ApolloClient from 'apollo-client';
import App, { AppContext, Container } from 'next/app';
import Head from 'next/head';

const resources = {
  [LOCALE_ENUM.EN_US]: en,
  [LOCALE_ENUM.ZH_CH]: zh,
};

class MyApp extends App<{
  pageProps: any;
}> {
  public client: ApolloClient<NormalizedCacheObject>;

  constructor(props) {
    super(props);
    this.client = getApollo({});
    if (process.browser) {
      i18nReact
        .init({
          debug: false,
          fallbackLng: LOCALE_ENUM.EN_US,
          lng: lngFromReq(),
          resources,
        })
        .catch(e => {
          Log.Error('Init i18nReact error:', e);
        });
    }
  }

  public static async getInitialProps({ Component, ctx }: AppContext) {
    // 第一次打开页面这里在服务端执行，以后只在浏览器切换路由时执行
    // 所以可以作为初始化国际化的地方
    // 另外这里可以拿到 req 对象，从而获取国际化的初始语言
    if (!process.browser) {
      try {
        await i18nReact.init({
          fallbackLng: LOCALE_ENUM.EN_US,
          lng: lngFromReq(ctx.req),
          resources,
        });
      } catch (e) {
        Log.Error('Init i18nReact error:', e);
      }
    }
    const client = getApollo({});
    ctx.client = client;
    const pageProps = await getInitialPropsResultOfComponent(Component, ctx);
    return {
      pageProps,
    };
  }

  public componentDidCatch(e) {
    Log.Error('error catch', e);
  }

  public render() {
    const { Component, pageProps } = this.props;
    // const Plain: React.SFC = ({ children }) => <>{children}</>;

    return (
      <>
        <Head>
          <meta
            data-n-head="true"
            name="viewport"
            content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no"
          />
        </Head>
        <Container>
          <I18nextProvider>
            <ApolloWrap client={this.client}>
              <div className={styles.select_lang}>
                <SeleceLang />
              </div>
              <Component {...pageProps} />
            </ApolloWrap>
          </I18nextProvider>
        </Container>
      </>
    );
  }
}

export default MyApp;
