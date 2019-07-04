import * as React from 'react';
import { Switch, Route } from 'react-router-dom';
import Home from '@/pages/Home';
import About from '@/pages/About';
// import 'antd/dist/antd.less';
import '@/global.less';

export const Routes: React.SFC = () => {
  return (
    <Switch>
      <Route exact path="/" component={Home} />
      <Route path="/about" component={About} />
    </Switch>
  );
};
