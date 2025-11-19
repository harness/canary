import { ReactNode } from 'react'

export interface TypesUser {
  admin?: boolean
  blocked?: boolean
  created?: number
  display_name?: string
  email?: string
  id?: number
  uid?: string
  updated?: number
  url?: string
}

export type NonEmptyReactNode = Exclude<ReactNode, boolean | null | undefined>
