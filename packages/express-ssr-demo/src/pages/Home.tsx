import * as React from 'react';
import { Link } from 'react-router-dom';
import * as styles from './home.less';
import { useStore } from '@/store';
import Button from 'antd/lib/button';
import 'antd/lib/button/style';

export const Home: React.SFC<{}> = props => {
  const { store, dispatch } = useStore();
  return (
    <div className={styles.home}>
      Home
      <hr />
      <Link to="/about">to about</Link>
      <div>
        <Button onClick={() => dispatch({ count: store.count + 1 })}>
          click to add:
        </Button>{' '}
        {store.count}
      </div>
    </div>
  );
};

export default Home;
