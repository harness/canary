import { Params } from 'react-router-dom'

import { CustomRouteObject } from './routes'

interface RouteEntry {
  name: keyof typeof RouteConstants // Enum keys
  path: string // e.g., ":spaceId/repos/create"
}

// Enum defining the route constants
export enum RouteConstants {
  toRepoSummary = 'toRepoSummary',
  toRepoCommits = 'toRepoCommits'
  // Add other routes here
}

// Type for a mapping of enum keys to functions that generate paths
type RouteNameToPathMap = Record<keyof typeof RouteConstants, (params: Params<string>) => string>

/**
 * Generates a map from route names to functions that replace route params.
 */
export const generateRouteNameToPathFunctions = (routeEntries: RouteEntry[]): RouteNameToPathMap => {
  return routeEntries.reduce<RouteNameToPathMap>((map, { name, path }) => {
    map[name] = (params: Params<string>) => {
      return path.replace(/:([a-zA-Z0-9_]+)/g, (_, key) => params[key] || `:${key}`)
    }
    return map
  }, {} as RouteNameToPathMap)
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
}): RouteNameToPathMap => {
  const routeEntries = generateRouteEntries({ routes, parentPath, parentName })
  return generateRouteNameToPathFunctions(routeEntries)
}
