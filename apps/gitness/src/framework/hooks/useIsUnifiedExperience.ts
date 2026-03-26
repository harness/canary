import { useMFEContext } from './useMFEContext'

export const useIsUnifiedExperience = (): boolean => {
  const { customHooks } = useMFEContext()
  const { PL_UNIFIED_OPT_IN_ENABLED } = customHooks?.useFeatureFlags?.() || {}

  return !!PL_UNIFIED_OPT_IN_ENABLED
}
