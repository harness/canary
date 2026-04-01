import { memo } from 'react'
import { Outlet } from 'react-router-dom'

import { Toaster } from '@harnessio/ui/components'
import { MainContentLayout } from '@harnessio/views'

import { FeatureFlag } from '../../framework/context/MFEContext'
import { useGetSpaceURLParam } from '../../framework/hooks/useGetSpaceParam'
import { useMFEContext } from '../../framework/hooks/useMFEContext'
import useSpaceSSEWithPubSub from '../../framework/hooks/useSpaceSSEWithPubSub'
import { Breadcrumbs } from '../breadcrumbs/breadcrumbs'
import { useGetBreadcrumbs } from '../breadcrumbs/useGetBreadcrumbs'

export const AppShellMFE = memo(() => {
  const { customHooks } = useMFEContext()
  const { breadcrumbs } = useGetBreadcrumbs()
  const spaceURL = useGetSpaceURLParam()
  const flags = (customHooks?.useFeatureFlags?.() ?? {}) as Record<string, unknown>
  const unifiedExperience =
    typeof window !== 'undefined' && window.localStorage.getItem('enable_unified_experience') === 'true'
  const hideLegacyMfeBreadcrumbs =
    Boolean(flags[FeatureFlag.PL_ENABLE_CANARY_UI]) ||
    (Boolean(flags[FeatureFlag.PL_UNIFIED_OPT_IN_ENABLED]) && unifiedExperience)

  useSpaceSSEWithPubSub({
    space: spaceURL ?? ''
  })

  return (
    <>
      {!hideLegacyMfeBreadcrumbs && <Breadcrumbs breadcrumbs={breadcrumbs} />}
      <MainContentLayout className="text-cn-2" withBreadcrumbs={!hideLegacyMfeBreadcrumbs && breadcrumbs.length > 0}>
        <Outlet />
      </MainContentLayout>
      <Toaster />
    </>
  )
})

AppShellMFE.displayName = 'AppShellMFE'
