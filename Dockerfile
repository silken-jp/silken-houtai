FROM nginx

COPY ./dist/ /usr/share/nginx/html
COPY ./docker/index.html /usr/share/nginx/html/index.html
COPY ./docker/sk-houtai.nginx.conf /etc/nginx/conf.d/sk-houtai.conf

EXPOSE 80