FROM node:12.6.0-alpine

COPY "$PWD/" /usr/share/react-ssr

WORKDIR /usr/share/react-ssr

RUN yarn install