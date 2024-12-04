import { FC, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import {
  Badge,
  DropdownMenuContent,
  DropdownMenuItem,
  Icon,
  SearchBox,
  Tabs,
  TabsList,
  TabsTrigger
} from '@/components'
import { BranchSelectorDropdownProps, BranchSelectorTab, getBranchSelectorLabels } from '@/views'
import { cn } from '@utils/cn'
import { BranchSelectorListItem } from '@views/repo/repo.types'

const filterItems = (items: BranchSelectorListItem[], query: string) => {
  if (!query.trim()) return items

  return items.filter(item => item.name.toLowerCase().includes(query.toLowerCase().trim()))
}

export const BranchSelectorDropdown: FC<BranchSelectorDropdownProps> = ({
  selectedBranch,
  branchList,
  tagList = [],
  onSelectBranch,
  repoId,
  spaceId,
  useTranslationStore
}) => {
  const [activeTab, setActiveTab] = useState<BranchSelectorTab>(BranchSelectorTab.BRANCHES)
  const [searchQuery, setSearchQuery] = useState('')
  const { t } = useTranslationStore()
  const BRANCH_SELECTOR_LABELS = getBranchSelectorLabels(t)

  const filteredItems = useMemo(() => {
    const sourceItems = activeTab === BranchSelectorTab.BRANCHES ? branchList : tagList

    return filterItems(sourceItems, searchQuery)
  }, [activeTab, branchList, tagList, searchQuery])

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value)
  }

  const viewAllUrl =
    activeTab === BranchSelectorTab.BRANCHES
      ? `/${spaceId}/repos/${repoId}/branches`
      : `/${spaceId}/repos/${repoId}/tags`

  return (
    <DropdownMenuContent className="w-[298px] p-0" align="start">
      <div className="px-3 pt-2">
        <span className="text-14 font-medium leading-none">Switch branches/tags</span>

        <SearchBox.Root
          className="mt-[18px] w-full"
          placeholder={BRANCH_SELECTOR_LABELS[activeTab].searchPlaceholder}
          value={searchQuery}
          handleChange={handleSearchChange}
          showOnFocus
        />
      </div>

      <Tabs
        className="mt-2"
        variant="branch"
        value={activeTab}
        onValueChange={value => {
          setActiveTab(value as BranchSelectorTab)
          setSearchQuery('')
        }}
      >
        <TabsList>
          <DropdownMenuItem
            className="rounded-t-md p-0"
            onSelect={e => {
              e.preventDefault()
              setActiveTab(BranchSelectorTab.BRANCHES)
            }}
          >
            <TabsTrigger
              className="data-[state=active]:bg-background-2"
              value="branches"
              onClick={e => e.stopPropagation()}
            >
              {t('views:repos.branches', 'Branches')}
            </TabsTrigger>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="rounded-t-md p-0"
            onSelect={e => {
              e.preventDefault()
              setActiveTab(BranchSelectorTab.TAGS)
            }}
          >
            <TabsTrigger
              className="data-[state=active]:bg-background-2"
              value="tags"
              onClick={e => e.stopPropagation()}
            >
              {t('views:repos.tags', 'Tags')}
            </TabsTrigger>
          </DropdownMenuItem>
        </TabsList>
      </Tabs>

      <div className="mt-1">
        {filteredItems.length === 0 && (
          <div className="px-5 py-4 text-center">
            <span className="text-14 leading-tight text-foreground-2">Nothing to show</span>
          </div>
        )}

        <div className="max-h-[360px] overflow-y-auto px-1">
          {filteredItems.map(item => {
            const isSelected = item.name === selectedBranch.name && item.sha === selectedBranch.sha
            const isDefault = activeTab === BranchSelectorTab.BRANCHES && (item as BranchSelectorListItem).default

            return (
              <DropdownMenuItem
                className={cn('hover:bg-background-4 cursor-pointer py-2 leading-none', {
                  'justify-between gap-x-2': isDefault,
                  'bg-background-4': isSelected,
                  'pl-7': !isSelected
                })}
                onClick={() => onSelectBranch(item, activeTab)}
                key={item.name}
              >
                <div className="flex w-full min-w-0 items-center gap-x-2">
                  {isSelected && <Icon name="tick" size={12} className="min-w-[12px] text-foreground-1" />}
                  <span
                    className={cn('text-foreground-2 truncate', {
                      'text-foreground-1': isSelected
                    })}
                  >
                    {item.name}
                  </span>
                </div>

                {isDefault && (
                  <Badge
                    className="bg-transparent font-medium text-foreground-3"
                    variant="outline"
                    // TODO: Review and update 'muted' theme implementation
                    // Current 'muted' theme styles don't fully match the design requirements
                    // Steps before updating:
                    // 1. Audit all instances of 'muted' theme usage
                    // 2. Compare with design specs across different components
                    // 3. Ensure changes won't break existing implementations
                    // 4. Consider creating a new theme variant if changes affect existing usage
                    // 5. After theme update, remove overriding classes (text-primary-muted, bg-transparent, -tracking, font-medium)
                    //    as they should be part of the theme definition
                    theme="muted"
                    size="18"
                    borderRadius="full"
                    disableHover
                  >
                    {t('views:repos.default', 'Default')}
                  </Badge>
                )}
              </DropdownMenuItem>
            )
          })}
        </div>

        <DropdownMenuItem className="p-0" asChild>
          <div className="mt-1 border-t border-borders-1 px-3 py-2">
            <Link to={viewAllUrl}>
              <span className="text-14 font-medium leading-none transition-colors duration-200 hover:text-foreground-1">
                {t('views:repos.viewAll', 'View all {{type}}', {
                  type: activeTab === BranchSelectorTab.BRANCHES ? t('views:repos.branches') : t('views:repos.tags')
                })}
              </span>
            </Link>
          </div>
        </DropdownMenuItem>
      </div>
    </DropdownMenuContent>
  )
}
