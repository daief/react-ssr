// 使用了 null-loader
// if (typeof require !== 'undefined') {
//   require.extensions['.css'] = file => {};
//   require.extensions['.less'] = file => {};
// }

import express from 'express';
import { resolve } from 'path';
import * as React from 'react';
import ReactDOMServer from 'react-dom/server';
// 引用 Server 端打包结果
const serverBuild = require('../distServer').default;
// 引用 Client manifest
const manifest = require('../distClient/manifest.json');

const app = express();

// 将 Client 输出目录作为静态资源目录
app.use(express.static(resolve(__dirname, '../distClient')));

// `/` `/about` 是支持 SSR 的路由
app.get(['/', '/about'], async (req, res) => {
  const context: any = {};

  // 已经渲染过的页面，这里不再渲染
  if (context.url) {
    res.writeHead(302, {
      Location: context.url,
    });
    res.end();
  } else {
    await new Promise(_ => {
      setTimeout(_, 500);
    });
    render(req, res, context, { count: 10 });
  }
});

function render(req, res, ctx, data) {
  // 通过 renderToString 将组件转换成 HTML 字符串
  const contentHtml = ReactDOMServer.renderToString(
    // 在服务端运行 React
    React.createElement(serverBuild(req, ctx, data)),
  );

  // 下面的是拼接出一个完整的 HTML 并发送给浏览器
  const renderLink = (): string => {
    return Object.keys(manifest)
      .filter(key => /\.css$/.test(key))
      .map(key => `<link rel="stylesheet" href="${manifest[key]}">`)
      .join('\n');
  };

  const renderScripts = (): string => {
    return Object.keys(manifest)
      .filter(key => /\.js$/.test(key))
      .map(key => `<script src="${manifest[key]}"></script>`)
      .join('\n');
  };

  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="ie=edge">
      <title>Document</title>
      ${renderLink()}
    </head>
    <body>
      <div id="root">${contentHtml}</div>
      <script>
        window.__INIT_STORE__ = ${JSON.stringify(data)}
      </script>
      ${renderScripts()}
    </body>
    </html>
  `);
}

const PORT = 5000;
app.listen(PORT, () => {
  // tslint:disable-next-line: no-console
  console.log(`http://localhost:${PORT}`);
});
