FROM node:16 as build-stage

WORKDIR /usr/src/app

COPY package.json ./
COPY yarn.lock ./

RUN yarn install

COPY . .

# RUN yarn build

# CMD [ "yarn", "start" ]
