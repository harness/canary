import { ScopeType } from '@views/common'

export interface SecretReference {
  name: string
  type: string
  scope: string
  createdAt: number
}

export interface SecretActivity {
  event: string
  type: string
  scope: ScopeType
  createdAt: number
  scopedPath: string
  entityRenderer?: JSX.Element
}
