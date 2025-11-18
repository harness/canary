import { ComponentType, ReactNode } from 'react'

export type TLinkComponent = ComponentType<{ to: string; children: ReactNode }>
