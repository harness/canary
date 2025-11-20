import { ReactNode } from 'react'

export type NonEmptyReactNode = Exclude<ReactNode, boolean | null | undefined>
