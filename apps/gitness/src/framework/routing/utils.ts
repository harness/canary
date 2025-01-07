import { Params } from 'react-router-dom'

import '../context/RoutingContext'

import { CustomRouteObject, RouteConstants, RouteEntry, RouteFunctionMap } from './types'

/**
 * @param routeEntries - An array of route entries, each containing a `name` and a `path` where the path may contain route parameters.
 * @returns A map where the key is a route name and the value is a function that takes parameters and returns the path with those parameters replaced.
 */
export const generateRouteNameToPathFunctions = (routeEntries: RouteEntry[]): RouteFunctionMap => {
  return routeEntries.reduce<RouteFunctionMap>((map, { name, path }) => {
    map[name] = (params: Params<string>) => {
      /* Replace each parameter in the path with the corresponding value from params */
      return path.replace(/:([a-zA-Z0-9_]+)/g, (_, key) => params[key] || `:${key}`)
    }
    return map
  }, {} as RouteFunctionMap)
}

/**
 * Recursively generates route entries from the route configuration.
 */
const generateRouteEntries = ({
  routes,
  parentPath = '',
  parentName = ''
}: {
  routes: CustomRouteObject[]
  parentPath?: string
  parentName?: string
}): RouteEntry[] => {
  const entries: RouteEntry[] = []

  routes.forEach(route => {
    const fullPath = `${parentPath}/${route.path || ''}`.replace(/\/\/+/g, '/')
    const routeNameBase = route.path?.replace(/[:/]/g, '_') || 'index'
    const routeName = parentName ? `${parentName}_${routeNameBase}` : routeNameBase

    if (route.handle?.routeName && RouteConstants[route.handle.routeName as keyof typeof RouteConstants]) {
      entries.push({
        name: route.handle.routeName as keyof typeof RouteConstants,
        path: fullPath.replace(/^\//, '')
      })
    }

    if (route.children) {
      entries.push(
        ...generateRouteEntries({
          routes: route.children,
          parentPath: fullPath,
          parentName: routeName
        })
      )
    }
  })

  return entries
}

/**
 * Generates a mapping of route names to functions that replace route params.
 */
export const getRouteMapping = ({
  routes,
  parentPath = '',
  parentName = ''
}: {
  routes: CustomRouteObject[]
  parentPath?: string
  parentName?: string
}): RouteFunctionMap => {
  const routeEntries = generateRouteEntries({ routes, parentPath, parentName })
  return generateRouteNameToPathFunctions(routeEntries)
}
