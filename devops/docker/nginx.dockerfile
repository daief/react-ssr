FROM nginx:1.17.1-alpine

COPY "$PWD/devops/nginx/react-ssr.conf" /etc/nginx/conf.d/

EXPOSE 80
