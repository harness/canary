import { index, layout, route, type RouteConfig } from '@react-router/dev/routes'

export default [
  index('routes/_index.tsx'),
  route('theme', './routes/theme.tsx'),
//   route(':spaceId/repos', './routes/$spaceId/repos/route.tsx')
] satisfies RouteConfig





// import { type RouteConfig } from '@react-router/dev/routes'
// import { flatRoutes } from '@react-router/fs-routes'

// export default flatRoutes() satisfies RouteConfig
