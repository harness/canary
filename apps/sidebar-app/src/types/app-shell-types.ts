import type { PropsWithChildren, ReactNode } from 'react'

import type { AppNavProps } from './app-nav-types'

export type AppProps = { nav: AppNavProps; header?: ReactNode }

export type AppShellLayoutProps = { header?: ReactNode; children: ReactNode }

export type AppShellHeaderProps = PropsWithChildren<{ className?: string }>

export type AppRouterProviderProps = { children: ReactNode }
