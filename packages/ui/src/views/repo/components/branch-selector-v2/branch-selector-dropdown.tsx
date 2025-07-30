import { FC, useMemo, useState } from 'react'

import { Button, DropdownMenu, Layout, Link, SearchInput, Tabs, Text } from '@/components'
import { useTranslation } from '@/context'
import { BranchSelectorDropdownProps, BranchSelectorTab, getBranchSelectorLabels } from '@/views'
import { wrapConditionalObjectElement } from '@utils/mergeUtils'

export const BranchSelectorDropdown: FC<BranchSelectorDropdownProps> = ({
  selectedBranch,
  branchList,
  tagList = [],
  onSelectBranch,
  repoId,
  spaceId,
  isBranchOnly = false,
  searchQuery,
  setSearchQuery,
  dynamicWidth = false,
  preSelectedTab = BranchSelectorTab.BRANCHES,
  isFilesPage = false,
  setCreateBranchDialogOpen
}) => {
  const [activeTab, setActiveTab] = useState<BranchSelectorTab>(preSelectedTab)
  const { t } = useTranslation()
  const BRANCH_SELECTOR_LABELS = getBranchSelectorLabels(t)

  const filteredItems = useMemo(() => {
    return activeTab === BranchSelectorTab.BRANCHES ? branchList : tagList
  }, [activeTab, branchList, tagList])

  const handleSearchChange = (query: string) => {
    setSearchQuery(query)
  }

  const viewAllUrl =
    activeTab === BranchSelectorTab.BRANCHES
      ? `${spaceId ? `/${spaceId}` : ''}/repos/${repoId}/branches`
      : `${spaceId ? `/${spaceId}` : ''}/repos/${repoId}/tags`

  return (
    <DropdownMenu.Content
      className="[&>.cn-dropdown-menu-container-header]:border-b-0 [&>.cn-dropdown-menu-container-header]:pb-0"
      style={{ width: dynamicWidth ? 'var(--radix-dropdown-menu-trigger-width)' : '358px' }}
      align="start"
      scrollAreaProps={{ className: 'max-h-[188px]' }}
    >
      <DropdownMenu.Header className="pb-0">
        <Layout.Grid gapY="sm">
          <Text variant="body-single-line-strong" color="foreground-1">
            {isBranchOnly ? 'Switch branches' : 'Switch branches/tags'}
          </Text>

          <SearchInput
            autoFocus
            id="search"
            placeholder={BRANCH_SELECTOR_LABELS[activeTab].searchPlaceholder}
            defaultValue={searchQuery}
            onChange={handleSearchChange}
            onKeyDown={e => e.stopPropagation()}
          />

          {!isBranchOnly && (
            <Tabs.Root
              value={activeTab}
              onValueChange={value => {
                setActiveTab(value as BranchSelectorTab)
                setSearchQuery('')
              }}
            >
              <Tabs.List className="-mx-3 px-3" activeClassName="bg-cn-background-3" variant="overlined">
                <Tabs.Trigger value="branches" onClick={() => setActiveTab(BranchSelectorTab.BRANCHES)}>
                  {t('views:repos.branches', 'Branches')}
                </Tabs.Trigger>

                <Tabs.Trigger value="tags" onClick={() => setActiveTab(BranchSelectorTab.TAGS)}>
                  {t('views:repos.tags', 'Tags')}
                </Tabs.Trigger>
              </Tabs.List>
            </Tabs.Root>
          )}
        </Layout.Grid>
      </DropdownMenu.Header>

      {filteredItems.length === 0 && (
        <DropdownMenu.NoOptions>
          {isFilesPage && activeTab === BranchSelectorTab.BRANCHES ? (
            <Button variant="link" className="w-full break-words" onClick={() => setCreateBranchDialogOpen?.(true)}>
              Create branch {searchQuery} from {selectedBranch?.name}
            </Button>
          ) : (
            <Text color="foreground-3">{t('views:noData.noResults', 'No search results')}</Text>
          )}
        </DropdownMenu.NoOptions>
      )}

      {filteredItems?.map(item => {
        const isSelected = selectedBranch ? item.name === selectedBranch.name : false
        const isDefault = activeTab === BranchSelectorTab.BRANCHES && !!item.default

        return (
          <DropdownMenu.Item
            onClick={() => onSelectBranch?.(item, activeTab)}
            key={item.name}
            title={item.name}
            checkmark={isSelected}
            {...wrapConditionalObjectElement(
              { tag: { theme: 'blue', size: 'sm', rounded: true, value: t('views:repos.default', 'Default') } },
              isDefault
            )}
          />
        )
      })}

      <DropdownMenu.Footer>
        <Link to={viewAllUrl} variant="secondary" className="w-full">
          {t('views:repos.viewAll', `View all ${activeTab}`, {
            type:
              activeTab === BranchSelectorTab.BRANCHES
                ? t('views:repos.branchesLowercase', 'branches')
                : t('views:repos.tagsLowercase', 'tags')
          })}
        </Link>
      </DropdownMenu.Footer>
    </DropdownMenu.Content>
  )
}
