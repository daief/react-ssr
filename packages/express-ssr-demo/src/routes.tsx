import '@/global.less';
import About from '@/pages/About';
import Home from '@/pages/Home';
import * as React from 'react';
import { Route, Switch } from 'react-router-dom';

export const Routes: React.SFC = () => {
  return (
    <Switch>
      <Route exact path="/" component={Home} />
      <Route path="/about" component={About} />
    </Switch>
  );
};
