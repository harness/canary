import type { ReactNode } from 'react'

import '@harnessio/ui/styles.css'
import './App.css'

import { AppShell } from './app-shell'
import { type AppNavProps } from './types/app-nav-types'

export type AppProps = { nav: AppNavProps; header?: ReactNode }

/** Layout only: `AppShell.Layout` → `AppShell.Nav` + `AppShell.Content`. Providers and nav data live outside (e.g. `AppRoot`, `SidebarDemo`). */
export const App = ({ nav, header }: AppProps) => (
  <AppShell.Layout header={header}>
    <AppShell.Nav {...nav} />
    <AppShell.Content />
  </AppShell.Layout>
)

export default App
