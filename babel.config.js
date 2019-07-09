module.exports = {
  // overrides: [
  //   {
  //     test: 'packages/nextjs-ssr',
  //     extends: 'packages/nextjs-ssr/.babelrc',
  //   },
  //   {
  //     test: 'packages/shared',
  //     extends: 'packages/shared/.babelrc',
  //   },
  // ],
  presets: ['next/babel'],
  plugins: [
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    ['import', { libraryName: 'antd', style: true }, 'antd'],
    'graphql-tag',
  ],
};
