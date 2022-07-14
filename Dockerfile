FROM node:lts

EXPOSE 3000
WORKDIR /
COPY . .
RUN yarn install

CMD ["yarn", "start"]
