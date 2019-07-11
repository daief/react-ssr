const withStyle = require('@react-ssr/shared/next-config/withStyle');
const withCommon = require('@react-ssr/shared/next-config/withCommon');
const path = require('path');
const glob = require('glob');

function readPages(dir) {
  const result = glob(path.resolve(dir, '**/*.@(tsx|ts|js|jsx)'), {
    sync: true,
  }).map(p => path.relative(dir, p));

  return (
    result
      // filter begin with `_`
      .filter(p => !/^_/.test(path.basename(p)))
      // remove ext, convert `index` => ``, `dir/index` => `dir/`
      .map(p => p.replace(/\.[^\.]+$/, '').replace(/\bindex\b/, ''))
      .map(p => `/${p}`)
  );
}

module.exports = withStyle(
  withCommon({
    /* config options here */
    distDir: '../build',
    async exportPathMap() {
      const result = {};
      readPages(path.resolve(__dirname, './src/pages')).forEach(page => {
        result[page] = {
          page,
        };
      });
      console.log('[ info ] next path map:');
      console.log(JSON.stringify(result, null, 2));
      return result;
    },
    webpack(config, options) {
      return config;
    },
  }),
);
