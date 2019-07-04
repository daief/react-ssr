import * as React from 'react';

export const StoreCtx = React.createContext<{ store: any; dispatch: any }>(
  null,
);
export const useStore = () => {
  const result = React.useContext(StoreCtx);
  if (!result) {
    throw new Error('Cannot get a store context');
  }
  return result;
};

export function createStore(initStore) {
  const [store, setStore] = React.useState<any>(initStore);
  return {
    store,
    dispatch: payload => setStore(pre => ({ ...pre, ...payload })),
  };
}
