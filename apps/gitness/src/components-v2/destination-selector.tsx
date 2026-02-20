import { FC, useCallback, useMemo, useState } from 'react'

import { useGetProjectAggregateDtoListQuery } from '@harnessio/react-ng-manager-swagger-service-client'
import { useGetOrganizationListQuery } from '@harnessio/react-ng-manager-v2-client'
import { useDebounceSearch } from '@harnessio/ui/hooks'
import { AccountInfo, DestinationSelectorDrawer, ScopeItem, ScopeType } from '@harnessio/views'

import { useMFEContext } from '../framework/hooks/useMFEContext'

export interface DestinationSelectorProps {
  title?: string
  triggerLabel?: string
  onDestinationChange?: (scope: ScopeItem | null, type: ScopeType) => void
}

export const DestinationSelector: FC<DestinationSelectorProps> = ({
  title = 'Destination selector',
  triggerLabel = 'Select destination',
  onDestinationChange
}) => {
  const { scope } = useMFEContext()
  const [selectedScope, setSelectedScope] = useState<ScopeItem | null>(null)
  const [scopeType, setScopeType] = useState<ScopeType | undefined>(undefined)
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('')

  const [selectedOrgFilter, setSelectedOrgFilter] = useState<string | undefined>(undefined)
  const [debouncedOrgFilterSearch, setDebouncedOrgFilterSearch] = useState('')

  const orgIdentifierForApi = useMemo(() => {
    if (!selectedOrgFilter) return undefined
    const parts = selectedOrgFilter.split('/')
    return parts.length > 1 ? parts[1] : parts[0]
  }, [selectedOrgFilter])

  const { handleStringSearchChange, handleResetSearch } = useDebounceSearch({
    handleChangeSearchValue: setDebouncedSearchQuery
  })

  const { handleStringSearchChange: handleOrgFilterSearchChange, handleResetSearch: handleResetOrgFilterSearch } =
    useDebounceSearch({ handleChangeSearchValue: setDebouncedOrgFilterSearch })

  const handleScopeTypeChange = useCallback(
    (newScopeType: ScopeType) => {
      setScopeType(newScopeType)
      setSelectedScope(null)
      handleResetSearch()
      handleResetOrgFilterSearch()
      setSelectedOrgFilter(undefined)
    },
    [handleResetSearch, handleResetOrgFilterSearch]
  )

  const account: AccountInfo = useMemo(
    () => ({
      value: scope.accountId || 'account',
      label: 'Account'
    }),
    [scope.accountId]
  )

  const orgsSearchTerm = useMemo(() => {
    if (scopeType === ScopeType.Organization) {
      return debouncedSearchQuery || undefined
    }
    if (scopeType === ScopeType.Project) {
      return debouncedOrgFilterSearch || undefined
    }
    return undefined
  }, [scopeType, debouncedSearchQuery, debouncedOrgFilterSearch])

  const { data: orgsData, isLoading: isLoadingOrgs } = useGetOrganizationListQuery(
    {
      queryParams: {
        accountIdentifier: scope.accountId || '',
        pageSize: 100,
        searchTerm: orgsSearchTerm
      }
    },
    {
      enabled: !!scope.accountId && (scopeType === ScopeType.Organization || scopeType === ScopeType.Project)
    }
  )

  const { data: projectsData, isLoading: isLoadingProjects } = useGetProjectAggregateDtoListQuery(
    {
      queryParams: {
        accountIdentifier: scope.accountId || '',
        moduleType: 'CODE',
        pageSize: 25,
        searchTerm: scopeType === ScopeType.Project ? debouncedSearchQuery || undefined : undefined,
        orgIdentifier: orgIdentifierForApi
      }
    },
    {
      enabled: !!scope.accountId && scopeType === ScopeType.Project
    }
  )

  // Transform organizations to ScopeItem format
  const organizationItems: ScopeItem[] = useMemo(() => {
    const content = orgsData?.body?.data?.content || []
    return content.map(org => ({
      value: `${scope.accountId}/${org.organization?.identifier || ''}`,
      label: org.organization?.name || org.organization?.identifier || '',
      scopeType: ScopeType.Organization
    }))
  }, [orgsData, scope.accountId])

  // Transform projects to ScopeItem format
  const projectItems: ScopeItem[] = useMemo(() => {
    const content = projectsData?.content?.data?.content || []
    return content.map(proj => {
      const { projectResponse: { project: { orgIdentifier = '', identifier = '', name = '' } = {} } = {} } = proj
      return {
        value: orgIdentifier && identifier ? `${scope.accountId}/${orgIdentifier}/${identifier}` : '',
        label: name || identifier,
        orgIdentifier: orgIdentifier || undefined,
        scopeType: ScopeType.Project
      }
    })
  }, [projectsData, scope.accountId])

  // Handle destination selection
  const handleDestinationSelection = useCallback(
    (selectedItem: ScopeItem | null, type: ScopeType) => {
      setSelectedScope(selectedItem)
      onDestinationChange?.(selectedItem, type)
    },
    [onDestinationChange]
  )

  const computedTriggerLabel = useMemo(() => {
    if (selectedScope) {
      if (selectedScope.scopeType === ScopeType.Account) {
        return account.label
      }
      return selectedScope.label
    }
    return triggerLabel
  }, [selectedScope, account.label, triggerLabel])

  const isLoading = useMemo(() => {
    if (scopeType === ScopeType.Organization) {
      return isLoadingOrgs
    }
    if (scopeType === ScopeType.Project) {
      return isLoadingProjects
    }
    return false
  }, [scopeType, isLoadingOrgs, isLoadingProjects])

  return (
    <DestinationSelectorDrawer
      title={title}
      triggerLabel={computedTriggerLabel}
      account={account}
      organizations={organizationItems}
      projects={projectItems}
      selectedScope={selectedScope ?? undefined}
      scopeType={scopeType}
      onScopeTypeChange={handleScopeTypeChange}
      onDestinationSelection={handleDestinationSelection}
      onSearchChange={handleStringSearchChange}
      selectedOrgFilter={selectedOrgFilter}
      onOrgFilterChange={setSelectedOrgFilter}
      onOrgFilterSearchChange={handleOrgFilterSearchChange}
      isLoading={isLoading}
    />
  )
}

DestinationSelector.displayName = 'DestinationSelector'
