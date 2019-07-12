# nextjs-static

这也是基于 Next.js 的项目，但该项目走静态部署，依赖 Next.js 提供的 Prerender，不需要 Node.js 层的支持。

该项目的请求基于 apollo-client，实现的是与 [nextjs-ssr](../packages/nextjs-ssr/) 相同的功能，所以同样需要 gql-server。另外，项目中新增 apollo-rest-link，实现通过 GraphQL 来调用 Rest API。

## Dev

```bash
$ yarn dev
```

页面访问地址：<http://account.example.com:3000/auth/login>。

## Build & Run

```bash
# 导出静态 HTML，输出目录为 dist/
$ yarn export
```

将 `dist/` 部署至静态服务器。
