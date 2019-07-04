import { Routes } from '@/routes';
import { createStore, StoreCtx } from '@/store';
import * as React from 'react';
import { StaticRouter } from 'react-router';

function ServerRender(req, context, initStore) {
  return props => {
    // hook 要在这、函数组件内部调用
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
