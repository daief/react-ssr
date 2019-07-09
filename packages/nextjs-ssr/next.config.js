const withStyle = require('@react-ssr/shared/next-config/withStyle');
const withCommon = require('@react-ssr/shared/next-config/withCommon');

module.exports = withStyle(
  withCommon({
    /* config options here */
    distDir: '../build',
    webpack(config, options) {
      return config;
    },
  }),
);
