# Test image: runs lint + tests in a clean Node environment,
# isolated from the Node/yarn installed on the host.
#
#   docker compose run --rm --build test
#   NODE_VERSION=24 docker compose run --rm --build test

ARG NODE_VERSION=22
FROM node:${NODE_VERSION}-bookworm-slim

WORKDIR /app
ENV CI=true

# Install dependencies first so this layer is cached until package.json/yarn.lock change
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile && yarn cache clean

COPY . .

CMD ["yarn", "test:coverage"]
