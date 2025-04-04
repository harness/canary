import { memo } from 'react'
import { Outlet } from 'react-router-dom'

import { MainContentLayout } from '@harnessio/ui/views'

import { useRepoImportEvents } from '../framework/hooks/useRepoImportEvent'
import { AppSideBar } from './app-side-bar'
import BreadcrumbsMFE from './breadcrumbs/breadcrumbs-mfe'
import { Toaster } from './toaster'

export const AppShellMFE = memo(() => {
  useRepoImportEvents()

  return (
    <>
      <AppSideBar getNavbarMenuData={() => []}>
        <MainContentLayout breadcrumbs={<BreadcrumbsMFE />} className="min-h-screen text-foreground-2">
          <Outlet />
        </MainContentLayout>
      </AppSideBar>
      <Toaster />
    </>
  )
})

AppShellMFE.displayName = 'AppShellMFE'
