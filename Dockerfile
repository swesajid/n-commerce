FROM node:18-alpine

WORKDIR /usr/src/app

ARG NODE_ENV
ENV NODE_ENV $NODE_ENV

COPY package*.json /usr/src/app/
RUN npm install --legacy-peer-deps

COPY . /usr/src/app

ENV PORT 7000
EXPOSE $PORT
CMD [ "npm", "run", "dev" ]