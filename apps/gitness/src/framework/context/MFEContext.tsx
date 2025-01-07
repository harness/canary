import { createContext } from 'react'

interface Scope {
  accountId?: string
  orgIdentifier?: string
  projectIdentifier?: string
}

interface IMFEContext {
  /**
   * Scope will be later referred from "Scope" from @harness/microfrontends
   *  */
  scope: Scope
  renderUrl: string
}
export const MFEContext = createContext<IMFEContext>({
  scope: {},
  renderUrl: ''
})
