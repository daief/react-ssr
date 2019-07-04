import * as React from 'react';
import { StaticRouter } from 'react-router';
import { Routes } from '@/routes';
import { StoreCtx, createStore } from '@/store';

function ServerRender(req, context, initStore) {
  return props => {
    // this is a hook, call inside render
    const value = createStore(initStore);
    return (
      <StoreCtx.Provider value={value}>
        <StaticRouter location={req.url} context={context}>
          <Routes />
        </StaticRouter>
      </StoreCtx.Provider>
    );
  };
}

export default ServerRender;
