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
