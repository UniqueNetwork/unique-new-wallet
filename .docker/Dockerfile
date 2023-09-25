FROM node:lts as builder
WORKDIR /app

COPY . .

RUN npm install
RUN npm run build


FROM nginx:alpine as static

WORKDIR /usr/share/nginx/html

COPY --from=builder /app/build /usr/share/nginx/html

CMD ["nginx"]

FROM nginx:alpine

WORKDIR /usr/share/nginx/html

COPY ./.docker/nginx.conf /etc/nginx/nginx.conf.template

COPY --from=builder /app/build /usr/share/nginx/html

COPY ./.docker/env.js /usr/share/nginx/html

COPY ./.docker/docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh


ENV DNS_RESOLVER=127.0.0.1
ENV PORT=80
ENV ENV_FILE=/usr/share/nginx/html/env.js
ENV INDEX_FILE=/usr/share/nginx/html/index.html

EXPOSE ${PORT}
ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["nginx"]
