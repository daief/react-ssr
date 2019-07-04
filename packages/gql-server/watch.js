const webpack = require('webpack');
const cfg = require('./webpack.config');
const { fork } = require('child_process');

const compile = webpack(cfg);

let tmp = null;
let isFirst = true;

compile.watch({}, (err, stats) => {
  if (err) {
    throw new Error('Webpack compile fail: ', err);
  }

  if (!isFirst) {
    console.clear();
    console.log('-------------------- Now restart ... --------------------');
  }

  if (tmp) {
    tmp.kill();
    tmp = null;
  }

  tmp = fork('./lib/index.js', [], { silent: false });
  isFirst = false;
});
