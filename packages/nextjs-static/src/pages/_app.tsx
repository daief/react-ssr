import styles from '@/global.less';
import authGql from '@/gqls/auth.gql';
import { lang as en } from '@/locales/en';
import { lang as zh } from '@/locales/zh';
import { FI } from '@axew/rc-if';
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
  rewriteT,
  SeleceLang,
} from '@react-ssr/shared/compts';
import { Log } from '@react-ssr/shared/src/Log';
import { Icon } from 'antd';
import { NormalizedCacheObject } from 'apollo-cache-inmemory';
import ApolloClient from 'apollo-client';
import { links } from 'libs/links';
import App, { Container } from 'next/app';
import Head from 'next/head';

const resources = {
  [LOCALE_ENUM.EN_US]: en,
  [LOCALE_ENUM.ZH_CH]: zh,
};

class MyApp extends App<any> {
  public client: ApolloClient<NormalizedCacheObject>;

  constructor(props) {
    super(props);
    this.client = getApollo({ links: links() });
    rewriteT();
    i18nReact
      .init({
        debug: false,
        fallbackLng: LOCALE_ENUM.EN_US,
        lng: process.browser ? lngFromReq() : undefined,
        resources,
      })
      .catch(e => {
        Log.Error('Init i18nReact error:', e);
      });
  }

  // public static async getInitialProps({ Component, ctx }: AppContext) {
  //   // 该生命周期不再使用
  //   const pageProps = await getInitialPropsResultOfComponent(Component, ctx);
  //   return {
  //     pageProps,
  //   };
  // }

  public componentDidCatch(e) {
    Log.Error('error catch', e);
  }

  public render() {
    const { Component, router } = this.props;
    const Plain: React.SFC = ({ children }) => <>{children}</>;
    // @ts-ignore
    const Layout = Component.Layout || Plain;
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
                <FI show={router.pathname !== '/auth/login'}>
                  <Icon
                    type="logout"
                    style={{ fontSize: 16, marginLeft: 10 }}
                    onClick={() => {
                      this.client.mutate({
                        mutation: authGql.logout,
                      });
                    }}
                  />
                </FI>
              </div>
              <Layout>
                <Component />
              </Layout>
            </ApolloWrap>
          </I18nextProvider>
        </Container>
      </>
    );
  }
}

export default MyApp;
