import { memo } from 'react'
import { Outlet } from 'react-router-dom'

import { Toaster } from '@harnessio/ui/components'
import { MainContentLayout } from '@harnessio/views'

import { useGetSpaceURLParam } from '../../framework/hooks/useGetSpaceParam'
import { useIsUnifiedExperience } from '../../framework/hooks/useIsUnifiedExperience'
import useSpaceSSEWithPubSub from '../../framework/hooks/useSpaceSSEWithPubSub'

export const AppShellMFE = memo(() => {
  const spaceURL = useGetSpaceURLParam()
  const isUnifiedExperience = useIsUnifiedExperience()

  useSpaceSSEWithPubSub({
    space: spaceURL ?? ''
  })

  const showBreadcrumbs = !isUnifiedExperience && breadcrumbs.length > 0

  return (
    <>
      {showBreadcrumbs && <Breadcrumbs breadcrumbs={breadcrumbs} />}
      <MainContentLayout className="text-cn-2" withBreadcrumbs={showBreadcrumbs}>
        <Outlet />
      </MainContentLayout>
      <Toaster />
    </>
  )
})

AppShellMFE.displayName = 'AppShellMFE'
