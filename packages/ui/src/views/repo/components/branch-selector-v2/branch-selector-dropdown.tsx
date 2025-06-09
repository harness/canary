import { FC, useMemo, useState } from 'react'

import { Button, DropdownMenu, Link, SearchInput, StatusBadge, Tabs } from '@/components'
import { useTranslation } from '@/context'
import { BranchSelectorDropdownProps, BranchSelectorTab, getBranchSelectorLabels } from '@/views'

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
      style={{
        width: dynamicWidth ? 'var(--radix-dropdown-menu-trigger-width)' : '298px'
      }}
      align="start"
    >
      <DropdownMenu.Header>
        <div className="">
          {isBranchOnly ? (
            <span className="text-2 font-medium leading-none">Switch branches</span>
          ) : (
            <span className="text-2 font-medium leading-none">Switch branches/tags</span>
          )}
          <div role="presentation" onKeyDown={e => e.stopPropagation()}>
            <SearchInput
              autoFocus
              inputContainerClassName="mt-2"
              id="search"
              size="sm"
              placeholder={BRANCH_SELECTOR_LABELS[activeTab].searchPlaceholder}
              defaultValue={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
        </div>

        {!isBranchOnly && (
          <Tabs.Root
            className="mb-[-11px] mt-2"
            value={activeTab}
            onValueChange={value => {
              setActiveTab(value as BranchSelectorTab)
              setSearchQuery('')
            }}
          >
            <Tabs.List className="px-3">
              <DropdownMenu.Item
                title={
                  <Tabs.Trigger
                    className="data-[state=active]:bg-cn-background-2"
                    value="branches"
                    onClick={e => e.stopPropagation()}
                  >
                    {t('views:repos.branches', 'Branches')}
                  </Tabs.Trigger>
                }
                className="rounded-t-md p-0"
                onSelect={e => {
                  e.preventDefault()
                  setActiveTab(BranchSelectorTab.BRANCHES)
                }}
              />
              <DropdownMenu.Item
                title={
                  <Tabs.Trigger
                    className="data-[state=active]:bg-cn-background-2"
                    value="tags"
                    onClick={e => e.stopPropagation()}
                  >
                    {t('views:repos.tags', 'Tags')}
                  </Tabs.Trigger>
                }
                className="rounded-t-md p-0"
                onSelect={e => {
                  e.preventDefault()
                  setActiveTab(BranchSelectorTab.TAGS)
                }}
              />
            </Tabs.List>
          </Tabs.Root>
        )}
      </DropdownMenu.Header>

      {filteredItems.length === 0 && (
        <div className="px-5 py-4 text-center">
          {isFilesPage && activeTab === BranchSelectorTab.BRANCHES ? (
            <div className="w-full overflow-hidden">
              <Button
                variant="link"
                className="inline-block h-auto max-w-full whitespace-normal text-left leading-tight"
                onClick={() => setCreateBranchDialogOpen?.(true)}
              >
                <span className="break-words">
                  Create branch {searchQuery} from {selectedBranch?.name}
                </span>
              </Button>
            </div>
          ) : (
            <span className="text-14 text-cn-foreground-2 leading-tight">
              {t('views:noData.noResults', 'No search results')}
            </span>
          )}
        </div>
      )}

      {!!filteredItems.length &&
        filteredItems.map(item => {
          const isSelected = selectedBranch ? item.name === selectedBranch.name : false
          const isDefault = activeTab === BranchSelectorTab.BRANCHES && item.default

          return (
            <DropdownMenu.Item
              onClick={() => onSelectBranch?.(item, activeTab)}
              key={item.name}
              title={
                <div className="flex w-full items-center justify-between gap-x-2">
                  {item.name}

                  {isDefault && (
                    <StatusBadge variant="outline" theme="muted" size="sm">
                      {t('views:repos.default', 'Default')}
                    </StatusBadge>
                  )}
                </div>
              }
              checkmark={isSelected}
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
