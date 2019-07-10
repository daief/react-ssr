// https://github.com/zeit/next.js/blob/canary/examples/with-yarn-workspaces/packages/web-app/next.config.js
const withTM = require('next-transpile-modules');
const path = require('path');

module.exports = (nextConfig = {}) => {
  return Object.assign(
    {},
    nextConfig,
    withTM({
      transpileModules: ['@react-ssr/shared'],
      webpack(config, options) {
        const { dev, isServer } = options;

        // 该插件置于 `resolve.plugins`
        config.resolve.plugins = [
          ...(config.resolve.plugins || []),
          new (require('tsconfig-paths-webpack-plugin'))({
            configFile: path.resolve(process.cwd(), 'src'),
          }),
        ];

        config.plugins.push(
          new (require('webpack')).IgnorePlugin(/^\.\/locale$/, /moment$/),
        );

        config.module.rules.push(
          {
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
          },
          {
            test: /\.(graphql|gql)$/,
            loader: 'graphql-tag/loader',
          },
        );

        config.module.rules.forEach(rule => {
          if (rule.use && rule.use.loader === 'next-babel-loader') {
            // 设置 babel 向上寻找 babel.config.js，然后将其所在的路径作为根（root）
            // 否则编译其他 package 时不会加载 babel 插件
            // https://babeljs.io/docs/en/config-files#project-wide-configuration
            rule.use.options.rootMode = 'upward';
          }
        });

        if (typeof nextConfig.webpack === 'function') {
          return nextConfig.webpack(config, options);
        }

        return config;
      },
    }),
  );
};
