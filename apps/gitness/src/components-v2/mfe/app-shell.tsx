import { memo } from 'react'
import { Outlet } from 'react-router-dom'

import { MainContentLayout } from '@harnessio/ui/views'

import { useRepoImportEvents } from '../../framework/hooks/useRepoImportEvent'
import { Breadcrumbs } from '../breadcrumbs/breadcrumbs'
import { useGetBreadcrumbs } from '../breadcrumbs/useGetBreadcrumbs'
import { Toaster } from '../toaster'
import { AppSidebar } from './side-bar'

export const AppShellMFE = memo(() => {
  useRepoImportEvents()
  const { breadcrumbs } = useGetBreadcrumbs()

  return (
    <>
      <AppSidebar>
        <Breadcrumbs breadcrumbs={breadcrumbs} />
        <MainContentLayout className="text-cn-foreground-2" withBreadcrumbs={breadcrumbs.length > 0}>
          <Outlet />
        </MainContentLayout>
        <Toaster />
      </AppSidebar>
    </>
  )
})

AppShellMFE.displayName = 'AppShellMFE'
