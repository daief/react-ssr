// https://github.com/zeit/next.js/blob/canary/examples/with-yarn-workspaces/packages/web-app/next.config.js
const withTM = require('next-transpile-modules');
const path = require('path');

module.exports = (nextConfig = {}) => {
  return Object.assign(
    {},
    nextConfig,
    // withTM
    {
      // transpileModules: ['@react-ssr/shared'],
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

        config.resolve.symlinks = false;
        config.module.rules.push({
          test: /\.(jsx?|tsx?)$/,
          include: [/@react-ssr/],
          // exclude: /node_modules/,
          loader: options.defaultLoaders.babel,
        });

        if (typeof nextConfig.webpack === 'function') {
          return nextConfig.webpack(config, options);
        }

        return config;
      },
    },
  );
};
