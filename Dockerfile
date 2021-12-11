FROM node:16.13.1-alpine

WORKDIR /app
RUN mkdir -p dist && chown node:node dist
COPY package.json yarn.lock ./
RUN yarn --pure-lockfile
COPY tsconfig.json tsconfig.build.json src ./

USER node

CMD ["yarn", "start:debug"]