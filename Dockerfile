FROM us-west1-docker.pkg.dev/gar-setup/docker/node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
# install pnpm
RUN npm install -g pnpm@latest-9
COPY . /canary
WORKDIR /canary

FROM base AS prod-deps
# install deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

FROM base AS build
# install deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
# Build packages sequentially to ensure dependencies are built before dependents
# (views depends on ui's dist/tailwind.config.js at vite config load time)
RUN pnpm -r --workspace-concurrency=1 --filter \!portal --filter \!design-system run build

FROM us-west1-docker.pkg.dev/gar-setup/docker/alpine:3.21 AS final
COPY --from=build /canary/apps/gitness/dist /canary-dist
WORKDIR /canary-dist

# FROM harness/harness:unscripted2024 AS server
# COPY --from=build /canary/apps/gitness/dist /canary
# ENV GITNESS_DEVELOPMENT_UI_SOURCE_OVERRIDE=/canary
