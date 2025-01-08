import { Params, RouteObject } from 'react-router-dom'

// Enum defining the route constants
export enum RouteConstants {
  toRepoSummary = 'toRepoSummary',
  toRepoCommits = 'toRepoCommits',
  toRepoBranches = 'toRepoBranches',
  toRepoFiles = 'toRepoFiles'
}

export interface RouteEntry {
  name: keyof typeof RouteConstants // Enum keys
  path: string // e.g., ":spaceId/repos/create"
}

// Type for a mapping of enum keys to functions that generate paths
export type RouteFunctionMap = Record<keyof typeof RouteConstants, (params: Params<string>) => string>

// Define a custom handle with the breadcrumb property
export interface CustomHandle {
  breadcrumb?: (params: Params<string>) => string
  routeName?: string
}

// Create a new type by intersecting RouteObject with the custom handle
export type CustomRouteObject = RouteObject & {
  handle?: CustomHandle
}
