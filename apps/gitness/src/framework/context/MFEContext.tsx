import { createContext } from 'react'

import { Scope } from '@harness/microfrontends'

interface IMFEContext {
  scope: Scope
  renderUrl: string
}
export const MFEContext = createContext<IMFEContext>({
  scope: {},
  renderUrl: ''
})
