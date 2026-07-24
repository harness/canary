import {
  ListPrincipalsProps,
  useListPrincipalsQuery,
  useListPrincipalsScopedQuery
} from '@harnessio/code-service-client'

import { FeatureFlag } from '../context/MFEContext'
import { useGetRepoId } from './useGetRepoId'
import { useMFEContext } from './useMFEContext'

export function useListPrincipalsWithScope(
  props: ListPrincipalsProps,
  options?: Parameters<typeof useListPrincipalsQuery>[1]
) {
  const {
    customHooks,
    scope: { accountId, orgIdentifier, projectIdentifier }
  } = useMFEContext()
  const repoIdentifier = useGetRepoId()
  const featureFlags = customHooks.useFeatureFlags?.() ?? {}
  const scopedListingEnabled = Boolean(featureFlags[FeatureFlag.CODE_PRINCIPALS_SCOPED_LISTING])
  const callerEnabled = options?.enabled ?? true
  const legacyEnabled = callerEnabled && !scopedListingEnabled
  const scopedEnabled = callerEnabled && scopedListingEnabled && Boolean(accountId)
  const { queryParams, ...fetcherProps } = props

  const legacyQuery = useListPrincipalsQuery(props, {
    ...options,
    enabled: legacyEnabled
  })
  const scopedQuery = useListPrincipalsScopedQuery(
    {
      ...fetcherProps,
      queryParams: {
        ...queryParams,
        accountIdentifier: accountId,
        orgIdentifier,
        projectIdentifier,
        ...(repoIdentifier ? { repoIdentifier } : {})
      }
    },
    {
      ...options,
      enabled: scopedEnabled
    }
  )

  return scopedListingEnabled ? scopedQuery : legacyQuery
}
