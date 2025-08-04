import { Context, createContext } from 'react'

import { noop } from 'lodash-es'

/**
 * @todo import from '@harness/microfrontends'
 * Currently, unable to do so due to npm access issues.
 */
export interface Scope {
  accountId?: string
  orgIdentifier?: string
  projectIdentifier?: string
}

export interface UserInfo {
  companyName?: string
  country?: string
  firstName?: string
  jobTitle?: string
  lastName?: string
  phoneNumber?: string
  state?: string
  userEmail?: string
}

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
  hooks: Hooks
  setMFETheme: (newTheme: string) => void
}

export const MFEContext = createContext<IMFEContext>({
  scope: {},
  parentContextObj: {
    appStoreContext: createContext({
      currentUserInfo: {}
    })
  },
  renderUrl: '',
  customHooks: {},
  customUtils: {},
  routes: {},
  hooks: {},
  setMFETheme: noop
})
