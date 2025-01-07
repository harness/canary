FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
COPY . /canary
WORKDIR /canary

FROM base AS prod-deps
# allow `@harness` packages to be loaded from github registry
ARG GIT_BOT_TOKEN
RUN echo @harness:registry=https://npm.pkg.github.com > .npmrc
RUN echo "//npm.pkg.github.com/:_authToken="$GIT_BOT_TOKEN >> .npmrc
RUN echo always-auth=true >> .npmrc
# install deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

FROM base AS build
# allow `@harness` packages to be loaded from github registry
ARG GIT_BOT_TOKEN
RUN echo @harness:registry=https://npm.pkg.github.com > .npmrc
RUN echo "//npm.pkg.github.com/:_authToken="$GIT_BOT_TOKEN >> .npmrc
RUN echo always-auth=true >> .npmrc
# install deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
# ENV NODE_OPTIONS=--max_old_space_size=8192
# build all the packages and apps
RUN pnpm run build
# build the microfrontend
WORKDIR /canary/apps/gitness
RUN pnpm run build:webpack

FROM node:20-slim AS final
COPY --from=build /canary/apps/gitness/dist /canary-dist
WORKDIR /canary-dist

# FROM harness/harness:unscripted2024 AS server
# COPY --from=build /canary/apps/gitness/dist /canary
# ENV GITNESS_DEVELOPMENT_UI_SOURCE_OVERRIDE=/canary
