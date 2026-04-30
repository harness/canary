import { RepoSettingsLayout } from '@harnessio/views'

import { FeatureFlag } from '../../framework/context/MFEContext'
import { useMFEContext } from '../../framework/hooks/useMFEContext'

export function RepoSettingsLayoutContainer() {
  const { customHooks } = useMFEContext()
  const featureFlags = (customHooks?.useFeatureFlags?.() ?? {}) as Record<string, boolean | undefined>
  const aiCodeReviewEnabled = !!featureFlags[FeatureFlag.CODE_AICR_ENABLED]

  return <RepoSettingsLayout aiCodeReviewEnabled={aiCodeReviewEnabled} />
}
