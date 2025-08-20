import { createContext } from 'react'
import { Location } from 'react-router-dom'

import { noop } from 'lodash-es'

import { PermissionsRequest } from '@harnessio/ui/components'

/**
 * @todo import from '@harness/microfrontends'
 * Currently, unable to do so due to npm access issues.
 */
export interface Scope {
  /** Account Id should always be available */
  accountId: string
  orgIdentifier?: string
  projectIdentifier?: string
}

export interface UserInfo {
  admin?: boolean
  billingFrequency?: string
  createdAt?: number
  defaultAccountId?: string
  disabled?: boolean
  edition?: string
  email?: string
  emailVerified?: boolean
  externalId?: string
  externallyManaged?: boolean
  familyName?: string
  givenName?: string
  intent?: string
  isEnrichedInfoCollected?: boolean
  lastLogin?: number
  lastUpdatedAt?: number
  locked?: boolean
  name?: string
  signupAction?: string
  token?: string
  twoFactorAuthenticationEnabled?: boolean
  userPreferences?: {
    [key: string]: string
  }
  uuid: string
}
// removed utmInfo and accounts from the above type

export interface UseLogoutReturn {
  forceLogout: () => void
}

export declare const useLogout: () => UseLogoutReturn

export declare const usePermission: (permissionsRequest?: PermissionsRequest, deps?: Array<any>) => Array<boolean>

export interface Hooks {
  useLogout?: typeof useLogout
  usePermission?: typeof usePermission
}

/**************/

export type Unknown = any

export interface IMFEContext {
  /**
   * Scope will be later referred from "Scope" from @harness/microfrontends
   *  */
  scope: Scope
  renderUrl: string
  location: Location
  currentUserInfo: UserInfo
  customHooks: Partial<{
    useGenerateToken: Unknown
  }>
  customUtils: Partial<{
    navigate: Unknown
    navigateToUserProfile: Unknown
  }>
  routes: Partial<{
    toAccountSettings: () => string
    toOrgSettings: () => string
    toProjectSettings: () => string
  }>
  routeUtils: Partial<{
    toCODERepository: ({ repoPath }: { repoPath: string }) => void
    toCODEPullRequest: ({ repoPath, pullRequestId }: { repoPath: string; pullRequestId: string }) => void
    toCODERule: ({ repoPath, ruleId }: { repoPath: string; ruleId: string }) => void
    toCODEManageRepositories: ({
      space,
      ruleId,
      settingSection
    }: {
      space: string
      ruleId: string
      settingSection: string
    }) => void
  }>
  hooks: Hooks
  setMFETheme: (newTheme: string) => void
}

export const MFEContext = createContext<IMFEContext>({
  location: {
    pathname: '',
    search: '',
    hash: '',
    state: null,
    key: ''
  } as Location,
  currentUserInfo: { uuid: '' },
  scope: { accountId: '' },
  renderUrl: '',
  customHooks: {},
  customUtils: {},
  routes: {},
  routeUtils: {},
  hooks: {},
  setMFETheme: noop
})
