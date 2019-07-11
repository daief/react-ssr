## express-ssr-demo

基于 express、React 从零搭建的一个 SSR demo。

## Dev

调试开发，需启动两个终端，一个监视 web 部分的变化并随之编译；另一个用于调试 Node.js 端脚本。

```bash
# 开启 web 部分文件监听
$ yarn watch:web

```

```bash
# Node.js 脚本监听
$ yarn dev:s

```

在 <http://localhost:5000> 查看效果。

## Build

打包构建。

```bash
$ yarn build

```

## Run

生产模式运行。

```bash
$ yarn start

```