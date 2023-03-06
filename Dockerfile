FROM node:18-alpine

RUN apk add --update --no-cache openssl1.1-compat

WORKDIR /var/express

COPY package.json /var/express
COPY yarn.lock /var/express

RUN yarn install

COPY . /var/express/

RUN yarn prisma generate

CMD ["yarn", "dev"]