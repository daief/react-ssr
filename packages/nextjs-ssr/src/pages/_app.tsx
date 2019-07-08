import '@/global.less';
import { getInitialPropsResultOfComponent } from '@react-ssr/shared/src/next-tools';
import App, { AppContext, Container } from 'next/app';
import Head from 'next/head';

class MyApp extends App<any> {
  public static async getInitialProps({ Component, ctx }: AppContext) {
    const errorPage = ctx.pathname === '/_error';
    const pageProps = await getInitialPropsResultOfComponent(Component, ctx);

    return {
      errorPage,
      pageProps,
    };
  }

  constructor(props) {
    super(props);
  }

  public componentDidMount() {
    // check account login status
    // console.log('componentDidMount');
  }

  public componentDidCatch(e) {
    // tslint:disable-next-line: no-console
    console.log('error catch', e);
  }

  public render() {
    const { errorPage, Component, pageProps } = this.props;
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
          <Component {...pageProps} />
        </Container>
      </>
    );
  }
}

export default MyApp;
