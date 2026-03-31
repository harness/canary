import { memo } from 'react'
import { Outlet } from 'react-router-dom'

import { Toaster } from '@harnessio/ui/components'
import { MainContentLayout } from '@harnessio/views'

import { useGetSpaceURLParam } from '../../framework/hooks/useGetSpaceParam'
import useSpaceSSEWithPubSub from '../../framework/hooks/useSpaceSSEWithPubSub'

export const AppShellMFE = memo(() => {
  const spaceURL = useGetSpaceURLParam()

  useSpaceSSEWithPubSub({
    space: spaceURL ?? ''
  })

  return (
    <>
      <MainContentLayout className="text-cn-2" withBreadcrumbs={false}>
        <Outlet />
      </MainContentLayout>
      <Toaster />
    </>
  )
})

AppShellMFE.displayName = 'AppShellMFE'
