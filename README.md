# react-ssr

这里是关于 SSR demo 以及一些 Next.js 使用的仓库合集，还包括一个 GraphQL 服务的搭建 demo。

<!--
对应文章 [《从零搭建 SRR》](https://daief.github.io/2019-07-02/get-a-ssr-demo-step-by-step.html)。
-->

## Index

这是一个 Monorepo（基于 yarn workspaces），下面是该仓库的目录。

| Package                                            | Description                                        |
| -------------------------------------------------- | -------------------------------------------------- |
| [express-ssr-demo](./packages/express-ssr-demo/)   | 从零搭建 React SSR                                 |
| [gql-server](./packages/gql-server/)               | GraphQL + fastify 服务                             |
| [nextjs-ssr](./packages/nextjs-ssr/)               | 基于 Next.js 搭建的 SSR demo，需要配合 gql-server 食用 |
| nextjs-static                                      | -                                                  |
| [react-ssr\_\_types](./packages/react-ssr__types/) | 辅助模块，提供 TS 类型                             |
| [shared](./packages/shared/)                       | 公共模块，各种不堪入目                             |

## Links

一些仓库和资料的链接。

- [TypeScript](https://github.com/microsoft/TypeScript) - [中文](https://www.tslang.cn/)
- [React](https://reactjs.org/)
- [Next.js](https://github.com/zeit/next.js)
- [GraphQL](https://graphql.org/) - [中文](https://graphql.cn/)
- [Apollo GraphQL](https://www.apollographql.com/docs/)
  - [Apollo React](https://github.com/apollographql/react-apollo/)
- [Webpack](https://webpack.js.org/)
- [Babel](https://babeljs.io/docs/en/)
- [Fastify](https://github.com/fastify/fastify)
