import {
  ListUsergroupsProps,
  useListUsergroupsQuery,
  useListUsergroupsScopedQuery
} from '@harnessio/code-service-client'

import { FeatureFlag } from '../context/MFEContext'
import { useMFEContext } from './useMFEContext'

export function useListUsergroupsWithScope(
  props: ListUsergroupsProps,
  options?: Parameters<typeof useListUsergroupsQuery>[1]
) {
  const {
    customHooks,
    scope: { accountId, orgIdentifier, projectIdentifier }
  } = useMFEContext()
  const featureFlags = customHooks.useFeatureFlags?.() ?? {}
  const scopedListingEnabled = Boolean(featureFlags[FeatureFlag.CODE_PRINCIPALS_SCOPED_LISTING])
  const callerEnabled = options?.enabled ?? true
  const legacyEnabled = callerEnabled && !scopedListingEnabled
  const scopedEnabled = callerEnabled && scopedListingEnabled && Boolean(accountId)
  const { queryParams, space_ref: _spaceRef, ...fetcherProps } = props

  const legacyQuery = useListUsergroupsQuery(props, {
    ...options,
    enabled: legacyEnabled
  })
  const scopedQuery = useListUsergroupsScopedQuery(
    {
      ...fetcherProps,
      queryParams: {
        ...queryParams,
        accountIdentifier: accountId,
        orgIdentifier,
        projectIdentifier
      }
    },
    {
      ...options,
      enabled: scopedEnabled
    }
  )

  return scopedListingEnabled ? scopedQuery : legacyQuery
}
