# nextjs-ssr

这是一个基于 Next.js 搭建的 SSR demo，需要配合 gql-server 食用。

项目主要包括：
  - Next.js 使用
  - GraphQL 使用
  - 单点登录（本地调试需要配置 hosts 模拟）
  - 语言国际化

## 配置 hosts

```bash
# hosts
# 模拟 gql-server 的域名
127.0.0.1			gql-server.example.com
# 模拟应用 account 的域名
127.0.0.1			account.example.com
# 模拟应用 customer 的域名
127.0.0.1			customer.example.com
```

## Dev

需要先启动 gql-server。

启动本项目。

```bash
$ yarn dev
```

访问地址：<http://account.example.com:3000/auth/login>。

## Build & Run

```bash
# build
$ yarn build
# then run
$ yarn start
```