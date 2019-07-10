/// <reference types="next" />
/// <reference types="next/types/global" />

import './extend-next';

declare global {
  declare module '*.less';
  declare module '*.png';

  declare module '*.gql' {
    import { DocumentNode } from 'graphql';
    const value: { [k: string]: DocumentNode };
    export = value;
  }

  interface String {
    // used for translation hint
    done: any;
  }
}
