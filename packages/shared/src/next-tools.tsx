import { NextComponentType } from 'next';

export async function getInitialPropsResultOfComponent(
  c: NextComponentType,
  ctx: any,
) {
  if (c && c.getInitialProps) {
    try {
      return await c.getInitialProps(ctx);
    } catch (error) {
      // tslint:disable-next-line: no-console
      console.log('error getInitialPropsResultOfComponent', error);
      return {};
    }
  }
  return {};
}
