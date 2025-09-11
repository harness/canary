import { Context, createContext } from 'react'

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

export interface ParentAppStoreContextProps {
  currentUserInfo: UserInfo
}

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

export interface MFEContextProps {
  /**
   * Scope will be later referred from "Scope" from @harness/microfrontends
   *  */
  scope: Scope
  renderUrl: string
  parentContextObj: {
    appStoreContext: Context<ParentAppStoreContextProps>
  }
  customHooks: Partial<{
    useGenerateToken: Unknown
    usePreferenceStore: Unknown
  }>
  customUtils: Partial<{
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
      settingSection,
      settingSectionMode
    }: {
      space: string
      ruleId: string
      settingSection: string
      settingSectionMode?: string
    }) => void
  }>
  hooks: Hooks
  setMFETheme: (newTheme: string) => void
  parentLocationPath: string
  onRouteChange: (updatedLocationPathname: string) => void
}

export const defaultContext: MFEContextProps = {
  scope: { accountId: '' },
  renderUrl: '',
  parentContextObj: {
    appStoreContext: createContext({ currentUserInfo: { uuid: '' } })
  },
  customHooks: {
    usePreferenceStore: () => ({ preference: undefined, setPreference: noop })
  },
  customUtils: {},
  routes: {},
  routeUtils: {},
  hooks: {},
  setMFETheme: noop,
  parentLocationPath: '',
  onRouteChange: noop
}

export const MFEContext = createContext<MFEContextProps>(defaultContext)
