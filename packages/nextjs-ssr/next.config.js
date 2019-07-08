// https://github.com/zeit/next.js/blob/canary/examples/with-yarn-workspaces/packages/web-app/next.config.js
const withTM = require('next-transpile-modules');
const withStyle = require('@react-ssr/shared/next-config/withStyle');

module.exports = withStyle(
  withTM({
    /* config options here */
    transpileModules: ['@react-ssr/shared'],
    webpack(config, options) {
      const { isServer } = options;
      // 该插件置于 `resolve.plugins`
      config.resolve.plugins = [
        ...(config.resolve.plugins || []),
        new (require('tsconfig-paths-webpack-plugin'))({
          configFile: process.cwd(),
        }),
      ];

      config.module.rules.push({
        test: /\.(jpe?g|png|svg|gif|ico|webp)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              // limit: 8192,
              limit: 1,
              fallback: 'file-loader',
              publicPath: `/_next/static/images/`,
              outputPath: `${isServer ? '../' : ''}static/images/`,
              name: '[name]-[hash].[ext]',
            },
          },
        ],
      });

      if (isServer) {
        // https://github.com/zeit/next.js/blob/canary/examples/with-ant-design/next.config.js
        const antStyles = /antd\/.*?\/style.*?/;
        const origExternals = [...config.externals];
        config.externals = [
          (context, request, callback) => {
            if (request.match(antStyles)) return callback();
            if (typeof origExternals[0] === 'function') {
              origExternals[0](context, request, callback);
            } else {
              callback();
            }
          },
          ...(typeof origExternals[0] === 'function' ? [] : origExternals),
        ];
      }

      return config;
    },
  }),
);
