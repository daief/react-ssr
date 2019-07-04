import giftImg from '@/assets/gift.png';
import { useStore } from '@/store';
import Button from 'antd/lib/button';
import 'antd/lib/button/style';
import * as React from 'react';
import { Link } from 'react-router-dom';
import * as styles from './home.less';

export const Home: React.SFC<{}> = props => {
  const { store, dispatch } = useStore();
  return (
    <div className={styles.home}>
      Home
      <hr />
      <div>
        <img src={giftImg} alt="gift" />
      </div>
      <hr />
      <Link to="/about">Go to about</Link>
      <hr />
      <div>
        <Button onClick={() => dispatch({ count: store.count + 1 })}>
          click to add:
        </Button>
        {store.count}
      </div>
    </div>
  );
};

export default Home;
