ARG NODE_VERSION=18.17.1

FROM node:${NODE_VERSION}-alpine as development
WORKDIR /elearning-system
COPY package.json yarn.lock tsconfig.json tsconfig.node.json vite.config.ts index.html *.config.cjs .env ./
COPY ./src ./src
RUN yarn install && yarn build

FROM node:${NODE_VERSION}-alpine as production
WORKDIR /elearning-system
COPY --from=development /elearning-system/dist .
RUN yarn global add serve

EXPOSE 4000
CMD serve -s . -l 4000