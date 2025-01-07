import { Params } from 'react-router-dom'

import '../context/RoutingContext'

import { CustomRouteObject, RouteConstants, RouteFunctionMap } from './types'

interface RouteEntry {
  name: keyof typeof RouteConstants // Enum keys
  path: string // e.g., ":spaceId/repos/create"
}

/**
 * Generates a map from route names to functions that replace route params.
 */
export const generateRouteNameToPathFunctions = (routeEntries: RouteEntry[]): RouteFunctionMap => {
  return routeEntries.reduce<RouteFunctionMap>((map, { name, path }) => {
    map[name] = (params: Params<string>) => {
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
