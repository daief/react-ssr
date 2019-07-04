import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Routes } from '@/routes';
import { createStore, StoreCtx } from '@/store';

// @ts-ignore
const initStore = window.__INIT_STORE__;

function ClientRender() {
  const value = createStore(initStore);
  return (
    <StoreCtx.Provider value={value}>
      <BrowserRouter>
        <Routes />
      </BrowserRouter>
    </StoreCtx.Provider>
  );
}

ReactDOM.hydrate(<ClientRender />, document.querySelector('#root'));
