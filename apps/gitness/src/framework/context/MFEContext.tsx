import { Context, createContext } from 'react'

import { noop } from 'lodash-es'

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

export interface Hooks {
  useLogout?: typeof useLogout
}

/**************/

export type Unknown = any

export interface IMFEContext {
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
  }>
  hooks: Hooks
  setMFETheme: (newTheme: string) => void
}

export const MFEContext = createContext<IMFEContext>({
  scope: { accountId: '' },
  parentContextObj: {
    appStoreContext: createContext({
      currentUserInfo: {
        uuid: ''
      }
    })
  },
  renderUrl: '',
  customHooks: {},
  customUtils: {},
  routes: {},
  routeUtils: {},
  hooks: {},
  setMFETheme: noop
})
