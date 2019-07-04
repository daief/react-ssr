const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  mode: process.env.NODE_ENV,
  target: 'node',
  context: process.cwd(),
  entry: {
    index: './src/index',
  },
  resolve: {
    extensions: ['.js', '.json', '.ts', '.tsx'],
    alias: {
      '@': path.resolve(__dirname, './src/'),
    },
  },
  output: {
    path: path.resolve(__dirname, './lib'),
    filename: 'index.js',
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        type: 'javascript/auto',
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
  externals: [
    nodeExternals({
      whitelist: [/@react-ssr/],
    }),
    nodeExternals({
      modulesDir: path.resolve(__dirname, '../../node_modules'),
      whitelist: [/@react-ssr/],
    }),
  ],
};
