import { memo } from 'react'
import { Outlet } from 'react-router-dom'

import { Toaster } from '@harnessio/ui/components'
import { MainContentLayout } from '@harnessio/ui/views'

import { useGetSpaceURLParam } from '../../framework/hooks/useGetSpaceParam'
import useSpaceSSEWithPubSub from '../../framework/hooks/useSpaceSSEWithPubSub'
import { Breadcrumbs } from '../breadcrumbs/breadcrumbs'
import { useGetBreadcrumbs } from '../breadcrumbs/useGetBreadcrumbs'

export const AppShellMFE = memo(() => {
  const { breadcrumbs } = useGetBreadcrumbs()
  const spaceURL = useGetSpaceURLParam()

  useSpaceSSEWithPubSub({
    space: spaceURL ?? ''
  })

  return (
    <>
      <Breadcrumbs breadcrumbs={breadcrumbs} />
      <MainContentLayout className="text-cn-2" withBreadcrumbs={breadcrumbs.length > 0}>
        <Outlet />
      </MainContentLayout>
      <Toaster />
    </>
  )
})

AppShellMFE.displayName = 'AppShellMFE'
