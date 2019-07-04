// 使用了 null-loader
// if (typeof require !== 'undefined') {
//   require.extensions['.css'] = file => {};
//   require.extensions['.less'] = file => {};
// }

import express from 'express';
import ReactDOMServer from 'react-dom/server';
import * as React from 'react';
import { resolve } from 'path';
const serverBuild = require('../distServer').default;
const manifest = require('../distClient/manifest.json');

const app = express();

app.use(express.static(resolve(__dirname, '../distClient')));

const render = (req, res, ctx, data) => {
  const contentHtml = ReactDOMServer.renderToString(
    React.createElement(serverBuild(req, ctx, data)),
  );

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
};

app.get(['/', '/about'], async (req, res) => {
  const context: any = {};

  if (context.url) {
    res.writeHead(302, {
      Location: context.url,
    });
    res.end();
  } else {
    await new Promise(resolve => {
      setTimeout(resolve, 500);
    });
    render(req, res, context, { count: 0 });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
