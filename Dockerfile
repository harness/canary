FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
COPY . /canary
WORKDIR /canary

FROM base AS prod-deps
# install deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

FROM base AS build
# install deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
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
