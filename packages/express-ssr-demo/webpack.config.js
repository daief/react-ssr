const merge = require('webpack-merge');
const nodeExternals = require('webpack-node-externals');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');

const isProd = process.env.NODE_ENV === 'production';

const antStyles = /antd\/.*?\/style.*?/;

const commonCfg = {
  mode: process.env.NODE_ENV,
  context: process.cwd(),
  output: {
    filename: '[name].js',
  },
  resolve: {
    extensions: ['.js', '.json', '.ts', '.tsx'],
    alias: {
      '@': path.resolve(__dirname, './src/'),
    },
  },
  module: {
    rules: [
      // url-loader
      {
        test: /\.(png|jpe?g|gif|webp)(\?.*)?$/,
        loader: 'url-loader/',
        options: {
          limit: 4096,
          fallback: {
            loader: 'file-loader',
            options: {
              name: 'static/[name].[hash:8].[ext]',
            },
          },
        },
      },
      // ts-loader
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        loader: 'ts-loader',
        options: {
          happyPackMode: true,
        },
      },
    ],
  },
  plugins: [new MiniCssExtractPlugin()],
};

const serverCfg = {
  target: 'node',
  entry: {
    index: './src/server',
  },
  output: {
    libraryTarget: 'commonjs',
    path: path.resolve(__dirname, './distServer'),
  },
  externals: [
    // https://github.com/liady/webpack-node-externals/issues/39#issuecomment-356647854
    nodeExternals({
      // https://github.com/zeit/next.js/blob/e00a2c5d64def08fc5c18c5262bfb52da7c87093/examples/with-ant-design/next.config.js#L11
      whitelist: [antStyles],
    }),
    nodeExternals({
      modulesDir: path.resolve(__dirname, '../../node_modules'),
      whitelist: [antStyles],
    }),
  ],
  module: {
    rules: [
      {
        test: antStyles,
        use: 'null-loader',
        enforce: 'pre',
      },
      // less
      {
        test: /\.less$/i,
        use: [
          // 本意不想在服务端配置进行拆离的，但不加的时候，服务端 CSS modules 会有问题
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: 'css-loader',
            options: {
              modules: {
                mode: 'global',
                localIdentName: '[local]--[hash:base64:5]',
              },
            },
          },
          {
            loader: 'less-loader',
            options: {
              javascriptEnabled: true,
            },
          },
        ],
      },
    ],
  },
};

const clientCfg = {
  entry: {
    index: './src/client',
  },
  output: {
    path: path.resolve(__dirname, './distClient'),
  },
  module: {
    rules: [
      // less
      {
        test: /\.less$/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: 'css-loader',
            options: {
              modules: {
                mode: 'global',
                localIdentName: '[local]--[hash:base64:5]',
              },
            },
          },
          {
            loader: 'less-loader',
            options: {
              javascriptEnabled: true,
            },
          },
        ],
      },
    ],
  },
  plugins: [new ManifestPlugin()].filter(Boolean),
};

module.exports = [merge(commonCfg, serverCfg), merge(commonCfg, clientCfg)];
