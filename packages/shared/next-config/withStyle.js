const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = (nextConfig = {}) => {
  return Object.assign({}, nextConfig, {
    webpack(config, options) {
      const { dev, isServer } = options;
      const {
        cssLoaderOptions,
        postcssLoaderOptions,
        lessLoaderOptions = {},
      } = nextConfig;

      options.defaultLoaders.css = [
        {
          loader: MiniCssExtractPlugin.loader,
        },
        {
          loader: 'css-loader',
          options: {
            sourceMap: dev,
            modules: {
              mode: 'global',
              localIdentName: '[local]--[hash:base64:5]',
            },
            ...cssLoaderOptions,
          },
        },
      ];

      options.defaultLoaders.less = [
        ...options.defaultLoaders.css,
        {
          loader: 'less-loader',
          options: {
            javascriptEnabled: true,
            ...lessLoaderOptions,
          },
        },
      ];

      config.module.rules.push(
        {
          test: /\.css$/,
          use: options.defaultLoaders.css,
        },
        {
          test: /\.less$/,
          use: options.defaultLoaders.less,
        },
      );

      config.plugins.push(
        new MiniCssExtractPlugin({
          filename: dev ? '[name].css' : '[name].[hash].css',
          chunkFilename: dev ? '[id].css' : '[id].[hash].css',
        }),
      );

      if (!dev && !isServer) {
        config.optimization.minimizer = [
          ...config.optimization.minimizer,
          new OptimizeCSSAssetsPlugin({}),
        ];
      }

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

      if (typeof nextConfig.webpack === 'function') {
        return nextConfig.webpack(config, options);
      }

      return config;
    },
  });
};
