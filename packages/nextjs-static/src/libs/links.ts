import { onApolloComplete } from './onApolloComplete';
import { restLink } from './restLink';

export function links() {
  return [onApolloComplete(), restLink()];
}
