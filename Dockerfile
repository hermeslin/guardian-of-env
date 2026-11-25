# Test image: runs lint, format check, typecheck and tests in a clean Node environment,
# isolated from the Node/npm installed on the host.
#
#   docker compose run --rm --build test
#   NODE_VERSION=24 docker compose run --rm --build test

ARG NODE_VERSION=22
FROM node:${NODE_VERSION}-bookworm-slim

WORKDIR /app
ENV CI=true

# Install dependencies first so this layer is cached until package.json/package-lock.json change
COPY package.json package-lock.json ./
RUN npm ci

COPY . .

CMD ["npm", "run", "check"]
