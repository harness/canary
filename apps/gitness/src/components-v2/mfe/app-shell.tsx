import { memo } from 'react'
import { Outlet } from 'react-router-dom'

import { MainContentLayout } from '@harnessio/ui/views'

import { useRepoImportEvents } from '../../framework/hooks/useRepoImportEvent'
import { Toaster } from '../toaster'
import BreadcrumbsMFE from './breadcrumbs'
import { AppSidebar } from './side-bar'

export const AppShellMFE = memo(() => {
  useRepoImportEvents()

  return (
    <>
      <AppSidebar>
        <MainContentLayout breadcrumbs={<BreadcrumbsMFE />} className="min-h-screen text-foreground-2">
          <Outlet />
        </MainContentLayout>
        <Toaster />
      </AppSidebar>
    </>
  )
})

AppShellMFE.displayName = 'AppShellMFE'
