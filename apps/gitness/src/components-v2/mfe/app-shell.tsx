import { memo } from 'react'
import { Outlet } from 'react-router-dom'

import { Toaster } from '@harnessio/ui/components'
import { MainContentLayout } from '@harnessio/ui/views'

import { useRepoImportEvents } from '../../framework/hooks/useRepoImportEvent'
import { Breadcrumbs } from '../breadcrumbs/breadcrumbs'
import { useGetBreadcrumbs } from '../breadcrumbs/useGetBreadcrumbs'

export const AppShellMFE = memo(() => {
  useRepoImportEvents()
  const { breadcrumbs } = useGetBreadcrumbs()

  return (
    <>
      <Breadcrumbs breadcrumbs={breadcrumbs} breadcrumbClassName="ml-2" />
      <MainContentLayout className="text-cn-foreground-2" withBreadcrumbs={breadcrumbs.length > 0} enableInset>
        <Outlet />
      </MainContentLayout>
      <Toaster />
    </>
  )
})

AppShellMFE.displayName = 'AppShellMFE'
