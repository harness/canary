import { ScopeType } from '@views/common'

import { IconV2NamesType } from '@harnessio/ui/components'

export interface SecretReference {
  name: string
  type: string
  scope: ScopeType
  createdAt: number
  scopedPath: string
  iconType?: IconV2NamesType
  rowLink?: string
}

export interface SecretActivity {
  event: string
  type: string
  scope: ScopeType
  createdAt: number
  scopedPath: string
  entityRenderer?: JSX.Element
}
