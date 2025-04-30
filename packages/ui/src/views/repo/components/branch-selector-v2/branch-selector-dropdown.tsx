import { ChangeEvent, FC, useMemo, useState } from 'react'

import { DropdownMenu, Icon, SearchBox, StatusBadge, Tabs } from '@/components'
import { useRouterContext } from '@/context'
import { BranchSelectorDropdownProps, BranchSelectorTab, getBranchSelectorLabels } from '@/views'
import { cn } from '@utils/cn'
import { BranchSelectorListItem } from '@views/repo/repo.types'

export const BranchSelectorDropdown: FC<BranchSelectorDropdownProps> = ({
  selectedBranch,
  branchList,
  tagList = [],
  onSelectBranch,
  repoId,
  spaceId,
  useTranslationStore,
  isBranchOnly = false,
  searchQuery,
  setSearchQuery,
  dynamicWidth = false,
  preSelectedTab = BranchSelectorTab.BRANCHES
}) => {
  const { Link } = useRouterContext()
  const [activeTab, setActiveTab] = useState<BranchSelectorTab>(preSelectedTab)
  const { t } = useTranslationStore()
  const BRANCH_SELECTOR_LABELS = getBranchSelectorLabels(t)

  const filteredItems = useMemo(() => {
    return activeTab === BranchSelectorTab.BRANCHES ? branchList : tagList
  }, [activeTab, branchList, tagList])

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value)
  }

  const viewAllUrl =
    activeTab === BranchSelectorTab.BRANCHES
      ? `${spaceId ? `/${spaceId}` : ''}/repos/${repoId}/branches`
      : `${spaceId ? `/${spaceId}` : ''}/repos/${repoId}/tags`

  return (
    <DropdownMenu.Content
      className="p-0"
      style={{
        width: dynamicWidth ? 'var(--radix-dropdown-menu-trigger-width)' : '298px'
      }}
      align="start"
    >
      <div className="px-3 pt-2">
        {isBranchOnly ? (
          <span className="text-2 font-medium leading-none">Switch branches</span>
        ) : (
          <span className="text-2 font-medium leading-none">Switch branches/tags</span>
        )}
        <div role="presentation" onKeyDown={e => e.stopPropagation()}>
          <SearchBox.Root
            className="mt-2 w-full"
            placeholder={BRANCH_SELECTOR_LABELS[activeTab].searchPlaceholder}
            value={searchQuery}
            handleChange={handleSearchChange}
            showOnFocus
          />
        </div>
      </div>

      {!isBranchOnly && (
        <Tabs.Root
          className="mt-2"
          value={activeTab}
          onValueChange={value => {
            setActiveTab(value as BranchSelectorTab)
            setSearchQuery('')
          }}
        >
          <Tabs.List className="px-3">
            <DropdownMenu.Item
              className="rounded-t-md p-0"
              onSelect={e => {
                e.preventDefault()
                setActiveTab(BranchSelectorTab.BRANCHES)
              }}
            >
              <Tabs.Trigger
                className="data-[state=active]:bg-cn-background-2"
                value="branches"
                onClick={e => e.stopPropagation()}
              >
                {t('views:repos.branches', 'Branches')}
              </Tabs.Trigger>
            </DropdownMenu.Item>
            <DropdownMenu.Item
              className="rounded-t-md p-0"
              onSelect={e => {
                e.preventDefault()
                setActiveTab(BranchSelectorTab.TAGS)
              }}
            >
              <Tabs.Trigger
                className="data-[state=active]:bg-cn-background-2"
                value="tags"
                onClick={e => e.stopPropagation()}
              >
                {t('views:repos.tags', 'Tags')}
              </Tabs.Trigger>
            </DropdownMenu.Item>
          </Tabs.List>
        </Tabs.Root>
      )}

      <div className="mt-1">
        {filteredItems.length === 0 && (
          <div className="px-5 py-4 text-center">
            <span className="text-14 leading-tight text-cn-foreground-2">
              {t('views:noData.noResults', 'No search results')}
            </span>
          </div>
        )}

        <div className="max-h-[360px] overflow-y-auto px-1">
          {filteredItems.map(item => {
            const isSelected = selectedBranch
              ? item.name === selectedBranch.name && item.sha === selectedBranch.sha
              : false
            const isDefault = activeTab === BranchSelectorTab.BRANCHES && (item as BranchSelectorListItem).default

            return (
              <DropdownMenu.Item
                className={cn('hover:bg-cn-background-hover cursor-pointer py-1', {
                  'justify-between gap-x-2': isDefault,
                  'bg-cn-background-hover': isSelected,
                  'pl-7': !isSelected
                })}
                onClick={() => {
                  onSelectBranch && onSelectBranch(item, activeTab)
                }}
                key={item.name}
              >
                <div className="flex w-full min-w-0 items-center gap-x-2">
                  {isSelected && <Icon name="tick" size={12} className="min-w-[12px] text-cn-foreground-1" />}
                  <span
                    className={cn('text-cn-foreground-2 truncate', {
                      'text-cn-foreground-1': isSelected
                    })}
                  >
                    {item.name}
                  </span>
                </div>

                {isDefault && (
                  <StatusBadge variant="outline" theme="muted" size="sm">
                    {t('views:repos.default', 'Default')}
                  </StatusBadge>
                )}
              </DropdownMenu.Item>
            )
          })}
        </div>

        <DropdownMenu.Item className="p-0" asChild>
          <Link to={viewAllUrl}>
            <div className="w-full border-t border-cn-borders-2 px-3 py-2">
              <span className="text-14 font-medium leading-none transition-colors duration-200 hover:text-cn-foreground-1">
                {t('views:repos.viewAll', `View all ${activeTab}`, {
                  type:
                    activeTab === BranchSelectorTab.BRANCHES
                      ? t('views:repos.branchesLowercase', 'branches')
                      : t('views:repos.tagsLowercase', 'tags')
                })}
              </span>
            </div>
          </Link>
        </DropdownMenu.Item>
      </div>
    </DropdownMenu.Content>
  )
}
