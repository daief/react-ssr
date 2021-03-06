const merge = require('webpack-merge');
const nodeExternals = require('webpack-node-externals');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');

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
      // less
      {
        test: /\.less$/i,
        use: [
          // 本意不想在服务端配置进行拆离的，但不加的时候，服务端 CSS modules 会有问题
          // 所以干脆都加上 MiniCssExtractPlugin 了
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
      // url-loader
      {
        test: /\.(png|jpe?g|gif|webp)(\?.*)?$/,
        loader: 'url-loader/',
        options: {
          // 这里设置成 1 是不让图片被处理成内联的 dataurl 数据
          limit: 1,
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
    // 排除 antd 样式以外的第三方依赖
    // https://github.com/liady/webpack-node-externals/issues/39#issuecomment-356647854
    nodeExternals({
      // https://github.com/zeit/next.js/blob/e00a2c5d64def08fc5c18c5262bfb52da7c87093/examples/with-ant-design/next.config.js#L11
      whitelist: [antStyles],
    }),
    // 兼容 workspaces
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
  plugins: [new ManifestPlugin()],
};

module.exports = [merge(commonCfg, serverCfg), merge(commonCfg, clientCfg)];
