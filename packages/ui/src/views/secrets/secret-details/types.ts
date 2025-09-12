import { IconV2NamesType } from '@components/icon-v2'
import { ScopeType } from '@views/common'

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
