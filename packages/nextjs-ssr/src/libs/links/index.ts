import { NextPageContext } from 'next-server/dist/lib/utils';
import { onApolloComplete } from './onApolloComplete';

export function links(opts: { ctx?: NextPageContext }) {
  return [onApolloComplete(opts)];
}
