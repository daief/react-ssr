import * as React from 'react';
import { useStore } from '@/store';
// import { Input } from 'antd';

export const About: React.SFC<{}> = props => {
  const { store } = useStore();

  return (
    <div>
      About
      <hr />
      {/* <Input /> */}
      <div onClick={() => console.log(111)}>count: {store.count}</div>
    </div>
  );
};

export default About;
