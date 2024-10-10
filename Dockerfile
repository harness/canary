FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
COPY . /canary
WORKDIR /canary

FROM base AS prod-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

FROM base AS build
# ENV NODE_OPTIONS=--max_old_space_size=8192
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run build

FROM nginx:alpine
# ARG API_URL=http://localhost:3000
# ENV API_URL=$API_URL
COPY --from=build /canary/apps/gitness/dist /canary
COPY --from=build /canary/nginx.conf /etc/nginx/nginx.conf
COPY --from=build /canary/entrypoint.sh /canary/entrypoint.sh
WORKDIR /canary
EXPOSE 8080
ENTRYPOINT ["sh", "/canary/entrypoint.sh"]
