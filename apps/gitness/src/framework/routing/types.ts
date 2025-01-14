import { Params, RouteObject } from 'react-router-dom'

// Enum defining the route constants
export enum RouteConstants {
  toHome = 'toHome',
  toLogout = 'toLogout',
  toSignIn = 'toSignIn',
  toRepositories = 'toRepositories',
  toRepoSummary = 'toRepoSummary',
  toRepoCommits = 'toRepoCommits',
  toRepoBranches = 'toRepoBranches',
  toRepoFiles = 'toRepoFiles',
  toRepoWebhooks = 'toRepoWebhooks',
  toPullRequests = 'toPullRequests',
  toPullRequestCompare = 'toPullRequestCompare',
  toPipelineEdit = 'toPipelineEdit',
  toPipelineExecutions = 'toPipelineExecutions',
  toPipelineExecution = 'toPipelineExecution',
  toRepoGeneralSettings = 'toRepoGeneralSettings',
  toRepoBranchRule = 'toRepoBranchRule',
  toRepoCommitDetails = 'toRepoCommitDetails'
}

export interface RouteEntry {
  name: keyof typeof RouteConstants // Enum keys
  path: string // e.g., ":spaceId/repos/create"
}

/**
 * Type for a mapping of enum keys to functions that generate paths.
 * Params are optional since some functions may not require params at all, for e.g. logout, login, etc.
 */
export type RouteFunctionMap = Record<keyof typeof RouteConstants, (params?: Params<string>) => string>

// Custom handle with the breadcrumb property
export interface CustomHandle {
  breadcrumb?: (params: Params<string>) => string
  routeName?: string
}

// Intersection of RouteObject with the custom handle
export type CustomRouteObject = RouteObject & {
  handle?: CustomHandle
}
