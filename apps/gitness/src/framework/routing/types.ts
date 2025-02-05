import { Params, RouteObject } from 'react-router-dom'

// Enum defining the route constants
export enum RouteConstants {
  toHome = 'toHome',
  toLogout = 'toLogout',
  toSignIn = 'toSignIn',
  toCreateRepo = 'toCreateRepo',
  toImportRepo = 'toImportRepo',
  toImportMultipleRepos = 'toImportMultipleRepos',
  toRepositories = 'toRepositories',
  toRepoSummary = 'toRepoSummary',
  toRepoCommits = 'toRepoCommits',
  toRepoBranches = 'toRepoBranches',
  toRepoFiles = 'toRepoFiles',
  toRepoWebhooks = 'toRepoWebhooks',
  toPullRequests = 'toPullRequests',
  toPullRequest = 'toPullRequest',
  toPullRequestCompare = 'toPullRequestCompare',
  toPullRequestConversation = 'toPullRequestConversation',
  toPullRequestCommits = 'toPullRequestCommits',
  toPullRequestChanges = 'toPullRequestChanges',
  toPullRequestChecks = 'toPullRequestChecks',
  toPipelineEdit = 'toPipelineEdit',
  toPipelines = 'toPipelines',
  toExecutions = 'toExecutions',
  toExecution = 'toExecution',
  toRepoGeneralSettings = 'toRepoGeneralSettings',
  toRepoBranchRule = 'toRepoBranchRule',
  toRepoBranchRules = 'toRepoBranchRules',
  toRepoCommitDetails = 'toRepoCommitDetails',
  toDatabases = 'toDatabases',
  toArtifacts = 'toArtifacts',
  toTheme = 'toTheme',
  toInfrastructureAsCode = 'toInfrastructureAsCode',
  toFeatureFlags = 'toFeatureFlags',
  toDevPortal = 'toDevPortal',
  toDevEnvironments = 'toDevEnvironments',
  toDevInsights = 'toDevInsights',
  toSecurityTests = 'toSecurityTests',
  toSupplyChain = 'toSupplyChain',
  toCloudCosts = 'toCloudCosts',
  toIncidents = 'toIncidents',
  toChaos = 'toChaos',
  toDashboards = 'toDashboards',
  toNotifications = 'toNotifications',
  toServiceReliability = 'toServiceReliability',
  toEnvironments = 'toEnvironments',
  toConnectors = 'toConnectors',
  toDelegates = 'toDelegates',
  toSecrets = 'toSecrets',
  toFileStore = 'toFileStore',
  toTemplates = 'toTemplates',
  toVariables = 'toVariables',
  toSloDowntime = 'toSloDowntime',
  toDiscovery = 'toDiscovery',
  toMonitoredServices = 'toMonitoredServices',
  toOverrides = 'toOverrides',
  toCertificates = 'toCertificates',
  toAdminUsers = 'toAdminUsers',
  toUserGroups = 'toUserGroups',
  toServiceAccounts = 'toServiceAccounts',
  toResourceGroups = 'toResourceGroups',
  toRoles = 'toRoles',
  toPolicies = 'toPolicies',
  toFreezeWindows = 'toFreezeWindows',
  toExternalTickets = 'toExternalTickets',
  toProjectMembers = 'toProjectMembers',
  toProjectGeneral = 'toProjectGeneral',
  toGitOps = 'toGitOps',
  toCI = 'toCI',
  toCode = 'toCode',
  toProfileKeys = 'toProfileKeys',
  toProfileGeneral = 'toProfileGeneral',
  toRepoLabels = 'toRepoLabels',
  toProjectLabels = 'toProjectLabels',
  toRepoWebhookDetails = 'toRepoWebhookDetails',
  toRepoWebhookExecutions = 'toRepoWebhookExecutions'
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
  /**
   * Defines the breadcrumb text or label using route parameters.
   */
  breadcrumb?: (params: Params<string>) => string | JSX.Element

  /**
   * Renders the breadcrumb as a custom React component instead of a link.
   */
  asLink?: boolean

  /**
   * Associated route name for the breadcrumb.
   */
  routeName?: string

  /**
   * Updates the document title based on route parameters.
   */
  pageTitle?: string | ((params: Params<string>) => string)
}

// Intersection of RouteObject with the custom handle
export type CustomRouteObject = RouteObject & {
  handle?: CustomHandle
}
