# gql-server

这是一个基于 Fastify + Apollo GraphQL 搭建的 GraphQL Server demo。

配合 nextjs-ssr 一起构成了 Node.js + SSR + GraphQL Server 的简单 demo。


## 域名模拟

- gql-server: <http://gql-server.example.com>

配置本地 hosts：

```bash
# gql-server
127.0.0.1   gql-server.example.com

```

## Dev

```bash
# 启动服务同时监听源文件变更
$ yarn watch

```

打开 <http://gql-server.example.com:4010/unified-certification> 可以看到用于调试的 Playground。

如果没有配置 hosts 可直接在 <http://127.0.0.1:4010/unified-certification> 查看。

## Build & Run

```bash
# build
$ yarn build

# then run
$ yarn start
```