import { FC, KeyboardEvent, useMemo, useState } from 'react'

import {
  Button,
  Command,
  DropdownMenu,
  IconV2,
  Layout,
  Link,
  Popover,
  SearchInput,
  Tabs,
  Tag,
  Text
} from '@/components'
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

  const onLinkEnter = (event: KeyboardEvent<HTMLAnchorElement>) => {
    if (event.key === 'Enter') {
      event.stopPropagation()
    }
  }

  return (
    <Popover.Content
      hideArrow
      onOpenAutoFocus={e => e.preventDefault()}
      className="p-0"
      style={{ width: dynamicWidth ? 'var(--radix-dropdown-menu-trigger-width)' : '358px' }}
      align="start"
    >
      <Command.Root className="bg-transparent">
        <div className="px-cn-sm pt-cn-sm">
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
                }}
              >
                <Tabs.List className="-mx-3 px-3" activeClassName="bg-cn-3" variant="overlined">
                  <Tabs.Trigger value="branches" onClick={() => setActiveTab(BranchSelectorTab.BRANCHES)}>
                    {t('views:repos.branches.title', 'Branches')}
                  </Tabs.Trigger>

                  <Tabs.Trigger value="tags" onClick={() => setActiveTab(BranchSelectorTab.TAGS)}>
                    {t('views:repos.tags', 'Tags')}
                  </Tabs.Trigger>
                </Tabs.List>
              </Tabs.Root>
            )}
          </Layout.Grid>
        </div>

        {filteredItems.length === 0 && setCreateBranchDialogOpen && (
          <div className="px-cn-xs py-cn-xl text-center">
            {activeTab === BranchSelectorTab.BRANCHES ? (
              <Button
                variant="link"
                className="size-full min-w-0 flex-wrap"
                onClick={() => setCreateBranchDialogOpen?.(true)}
              >
                Create branch{' '}
                <Text className="font-[inherit]" color="inherit" truncate>
                  {searchQuery}
                </Text>{' '}
                from {selectedBranch?.name}
              </Button>
            ) : (
              <Text color="foreground-3">{t('views:noData.noResults', 'No search results')}</Text>
            )}
          </div>
        )}

        {filteredItems.length === 0 && !setCreateBranchDialogOpen && (
          // renders text element
          <DropdownMenu.NoOptions>
            {t('views:repos.branchDoesNotExist', 'Branch does not exist.')}
          </DropdownMenu.NoOptions>
        )}

        <Command.List scrollAreaProps={{ className: 'max-h-[180px] p-cn-3xs' }}>
          {filteredItems?.map(item => {
            const isSelected = selectedBranch ? item.name === selectedBranch.name : false
            const isDefault = activeTab === BranchSelectorTab.BRANCHES && !!item.default

            return (
              <Command.Item
                className="py-cn-xs gap-cn-sm"
                onSelect={() => onSelectBranch?.(item, activeTab)}
                key={item.name}
                value={item.name}
                title={item.name}
              >
                <div className="ml-cn-xs flex size-4 items-center">{isSelected && <IconV2 name="check" />}</div>
                {item.name}
                {isDefault && <Tag theme="blue" size="sm" rounded value={t('views:repos.default', 'Default')} />}
              </Command.Item>
            )
          })}
        </Command.List>

        <div className="px-cn-sm border-cn-3 border-t border-solid py-2.5">
          <Link to={viewAllUrl} variant="secondary" className="w-full" onKeyDown={onLinkEnter}>
            {t('views:repos.viewAll', `View all ${activeTab}`, {
              type:
                activeTab === BranchSelectorTab.BRANCHES
                  ? t('views:repos.branchesLowercase', 'branches')
                  : t('views:repos.tagsLowercase', 'tags')
            })}
          </Link>
        </div>
      </Command.Root>
    </Popover.Content>
  )
}
