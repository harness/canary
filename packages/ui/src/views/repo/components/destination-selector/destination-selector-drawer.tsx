import { FC, useCallback, useMemo, useState } from 'react'

import {
  Button,
  ButtonLayout,
  Drawer,
  IconV2,
  Layout,
  scopeTypeToIconMap,
  SearchInput,
  Select,
  Skeleton,
  Table,
  Text
} from '@/components'
import { useTranslation } from '@/context'
import { ScopeType } from '@views/common'

export interface ScopeItem {
  value: string
  label: string
  orgIdentifier?: string
  scopeType: ScopeType
}

export interface AccountInfo {
  value: string
  label: string
}

export interface DestinationSelectorDrawerProps {
  title?: string
  triggerLabel?: string
  account?: AccountInfo
  organizations?: ScopeItem[]
  projects?: ScopeItem[]
  selectedScope?: ScopeItem
  scopeType?: ScopeType
  onScopeTypeChange: (scopeType: ScopeType) => void
  onDestinationSelection: (scope: ScopeItem | null, type: ScopeType) => void
  onSearchChange?: (query: string) => void
  selectedOrgFilter?: string
  onOrgFilterChange?: (orgIdentifier: string | undefined) => void
  onOrgFilterSearchChange?: (query: string) => void
  isLoading?: boolean
}

const ALL_ORGANIZATIONS = 'all'

export const DestinationSelectorDrawer: FC<DestinationSelectorDrawerProps> = ({
  title = 'Scope selector',
  triggerLabel = 'Select scope',
  account,
  organizations = [],
  projects = [],
  selectedScope,
  scopeType,
  onScopeTypeChange,
  onDestinationSelection,
  onSearchChange,
  selectedOrgFilter: selectedOrgFilterProp,
  onOrgFilterChange,
  onOrgFilterSearchChange,
  isLoading = false
}) => {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const scopeOptions = useMemo(
    () => [
      {
        value: ScopeType.Account,
        label: (
          <Layout.Horizontal gap="sm" align="center">
            <IconV2 name={scopeTypeToIconMap[ScopeType.Account]} size="sm" />
            <Text>{t('views:repos.account', 'Account')}</Text>
          </Layout.Horizontal>
        )
      },
      {
        value: ScopeType.Organization,
        label: (
          <Layout.Horizontal gap="sm" align="center">
            <IconV2 name={scopeTypeToIconMap[ScopeType.Organization]} size="sm" />
            <Text>{t('views:repos.organization', 'Organization')}</Text>
          </Layout.Horizontal>
        )
      },
      {
        value: ScopeType.Project,
        label: (
          <Layout.Horizontal gap="sm" align="center">
            <IconV2 name={scopeTypeToIconMap[ScopeType.Project]} size="sm" />
            <Text>{t('views:repos.projects', 'Projects')}</Text>
          </Layout.Horizontal>
        )
      }
    ],
    [t]
  )

  // Organization filter options for the Projects view
  const orgFilterOptions = useMemo(() => {
    const options = [{ value: ALL_ORGANIZATIONS, label: t('views:repos.allOrganizations', 'All Organizations') }]
    organizations.forEach(org => {
      options.push({ value: org.value, label: org.label })
    })
    return options
  }, [organizations])

  // Items are now filtered by API (search and org filter handled by parent)
  // Just return the appropriate list based on scope type
  const items = useMemo(() => {
    if (scopeType === ScopeType.Account) {
      return [] // No list for account scope
    }
    return scopeType === ScopeType.Organization ? organizations : projects
  }, [scopeType, organizations, projects])

  const handleSearch = useCallback(
    (value: string) => {
      setSearchQuery(value)
      onSearchChange?.(value)
    },
    [onSearchChange]
  )

  const handleScopeTypeChange = useCallback(
    (value: string) => {
      const newScopeType = value as ScopeType
      // Notify parent of scope type change (parent resets org filter)
      onScopeTypeChange(newScopeType)
      setSearchQuery('')

      if (newScopeType === ScopeType.Account && account) {
        onDestinationSelection(
          { value: account.value, label: account.label, scopeType: ScopeType.Account },
          ScopeType.Account
        )
      }
    },
    [account, onDestinationSelection, onScopeTypeChange]
  )

  const handleOrgFilterChange = useCallback(
    (value: string) => {
      onOrgFilterChange?.(value === ALL_ORGANIZATIONS ? undefined : value)
    },
    [onOrgFilterChange]
  )

  const handleSelectItem = useCallback(
    (item: ScopeItem) => {
      if (scopeType) {
        onDestinationSelection(item, scopeType)
        setIsOpen(false)
      }
    },
    [onDestinationSelection, scopeType]
  )

  return (
    <Layout.Vertical gap="sm">
      <Text variant="body-strong">{title}</Text>
      <Drawer.Root open={isOpen} onOpenChange={setIsOpen}>
        <Drawer.Trigger>
          <Button variant="outline" className="w-full justify-between">
            {selectedScope ? (
              <Layout.Horizontal gap="sm" align="center">
                <IconV2 name={scopeTypeToIconMap[selectedScope.scopeType]} size="sm" />
                <Text>
                  {selectedScope.scopeType === ScopeType.Project && selectedScope.orgIdentifier
                    ? `${selectedScope.orgIdentifier}/${selectedScope.label}`
                    : selectedScope.label}
                </Text>
              </Layout.Horizontal>
            ) : (
              <Text color="foreground-3">{triggerLabel}</Text>
            )}
            <IconV2 name="nav-arrow-right" size="xs" />
          </Button>
        </Drawer.Trigger>
        <Drawer.Content size="md">
          <Drawer.Header>
            <Drawer.Title>{title}</Drawer.Title>
          </Drawer.Header>

          <Drawer.Body>
            <Layout.Vertical gap="lg">
              {/* Scope Type Selector */}
              <Layout.Vertical gap="sm">
                <Text variant="body-strong">{t('views:repos.selectScope', 'Select scope')}</Text>
                <Select
                  value={scopeType}
                  options={scopeOptions}
                  onChange={handleScopeTypeChange}
                  placeholder={t('views:repos.selectScopePlaceholder', 'Select scope type')}
                  contentWidth="triggerWidth"
                />
              </Layout.Vertical>

              {scopeType === ScopeType.Account && account && (
                <div className="rounded-md bg-cn-2 p-cn-md">
                  <Layout.Horizontal gap="sm" className="items-center">
                    <IconV2 name={scopeTypeToIconMap[ScopeType.Account]} size="sm" />
                    <Text>{account.label}</Text>
                  </Layout.Horizontal>
                </div>
              )}

              {(scopeType === ScopeType.Organization || scopeType === ScopeType.Project) && (
                <>
                  {/* Search and Organization Filter Row */}
                  <Layout.Horizontal gap="md" className="items-end">
                    <SearchInput
                      placeholder={t('views:repos.search', 'Search')}
                      value={searchQuery}
                      onChange={handleSearch}
                      className="flex-1"
                    />

                    {scopeType === ScopeType.Project && (
                      <Select
                        value={selectedOrgFilterProp || ALL_ORGANIZATIONS}
                        options={orgFilterOptions}
                        onChange={handleOrgFilterChange}
                        wrapperClassName="w-48"
                        allowSearch
                        onSearch={onOrgFilterSearchChange}
                      />
                    )}
                  </Layout.Horizontal>

                  {/* Scope List */}
                  <Layout.Vertical gap="none">
                    {isLoading ? (
                      <Skeleton.List linesCount={8} />
                    ) : items.length > 0 ? (
                      <Table.Root>
                        <Table.Header>
                          <Table.Row>
                            <Table.Head>
                              {scopeType === ScopeType.Organization
                                ? t('views:repos.organization', 'Organization')
                                : t('views:repos.projects', 'Projects')}
                            </Table.Head>
                          </Table.Row>
                        </Table.Header>
                        <Table.Body>
                          {items.map(item => {
                            const isSelected =
                              selectedScope?.value === item.value && selectedScope?.scopeType === item.scopeType
                            return (
                              <Table.Row
                                key={item.value}
                                className="cursor-pointer"
                                onClick={() => handleSelectItem(item)}
                              >
                                <Table.Cell>
                                  <Layout.Horizontal gap="xs" align="center" justify="between">
                                    <Layout.Horizontal gap="xs" align="center">
                                      <IconV2 name={scopeTypeToIconMap[scopeType]} size="sm" />
                                      <Text variant="body-normal" truncate>
                                        {scopeType === ScopeType.Project && item.orgIdentifier
                                          ? `${item.orgIdentifier}/${item.label}`
                                          : item.label}
                                      </Text>
                                    </Layout.Horizontal>
                                    {isSelected && <IconV2 name="check" size="sm" />}
                                  </Layout.Horizontal>
                                </Table.Cell>
                              </Table.Row>
                            )
                          })}
                        </Table.Body>
                      </Table.Root>
                    ) : (
                      <Text className="py-cn-lg text-center" color="foreground-3">
                        {t('views:repos.noResultsFound', 'No results found')}
                      </Text>
                    )}
                  </Layout.Vertical>
                </>
              )}
            </Layout.Vertical>
          </Drawer.Body>

          <Drawer.Footer>
            <ButtonLayout.Root>
              <ButtonLayout.Secondary>
                <Drawer.Close asChild>
                  <Button variant="outline">{t('views:repos.cancel', 'Cancel')}</Button>
                </Drawer.Close>
              </ButtonLayout.Secondary>
            </ButtonLayout.Root>
          </Drawer.Footer>
        </Drawer.Content>
      </Drawer.Root>
    </Layout.Vertical>
  )
}

DestinationSelectorDrawer.displayName = 'DestinationSelectorDrawer'
