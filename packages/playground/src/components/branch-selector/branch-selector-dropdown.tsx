import { useState } from 'react'
import { Link } from 'react-router-dom'

import {
  Badge,
  cn,
  DropdownMenuContent,
  DropdownMenuItem,
  Icon,
  SearchBox,
  Tabs,
  TabsList,
  TabsTrigger,
  Text
} from '@harnessio/canary'

import {
  BranchSelectorBaseItem,
  BranchSelectorBranchListProps,
  BranchSelectorBranchProps,
  BranchSelectorTab,
  BranchSelectorTagListProps
} from './types'

const BRANCH_SELECTOR_LABELS = {
  [BranchSelectorTab.BRANCHES]: {
    label: 'Branches',
    searchPlaceholder: 'Find a branch'
  },
  [BranchSelectorTab.TAGS]: {
    label: 'Tags',
    searchPlaceholder: 'Find a tag'
  }
} as const

export interface BranchSelectorDropdownProps {
  name: string
  branchList: BranchSelectorBranchListProps
  tagList: BranchSelectorTagListProps
  selectBranch: (branch: BranchSelectorBranchProps | BranchSelectorBaseItem) => void
}

const filterItems = (items: BranchSelectorBranchProps[] | BranchSelectorBaseItem[], query: string) => {
  if (!query.trim()) return items

  return items.filter(item => item.name.toLowerCase().includes(query.toLowerCase().trim()))
}

export const BranchSelectorDropdown = ({ name, branchList, tagList, selectBranch }: BranchSelectorDropdownProps) => {
  const [activeTab, setActiveTab] = useState<BranchSelectorTab>(BranchSelectorTab.BRANCHES)
  const [searchQuery, setSearchQuery] = useState('')

  const sourceItems = activeTab === BranchSelectorTab.BRANCHES ? branchList.items : (tagList.items ?? [])
  const filteredItems = filterItems(sourceItems, searchQuery)

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value)
  }

  const viewAllUrl = activeTab === BranchSelectorTab.BRANCHES ? branchList.viewAllUrl : tagList.viewAllUrl

  return (
    <DropdownMenuContent className="w-[298px] p-0" align="start">
      <div className="px-3 pt-2">
        <Text className="leading-none" size={2} weight="medium">
          Switch branches/tags
        </Text>

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
              Branches
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
              Tags
            </TabsTrigger>
          </DropdownMenuItem>
        </TabsList>
      </Tabs>

      <div className="mt-1">
        {filteredItems.length === 0 && (
          <div className="px-5 py-4 text-center">
            <Text className="leading-tight text-foreground-2" size={2}>
              Nothing to show
            </Text>
          </div>
        )}

        <div className="max-h-[360px] overflow-y-auto px-1">
          {filteredItems.map(item => {
            const isSelected = item.name === name
            const isDefault = activeTab === BranchSelectorTab.BRANCHES && (item as BranchSelectorBranchProps).default

            return (
              <DropdownMenuItem
                className={cn('hover:bg-background-4 cursor-pointer py-2 leading-none', {
                  'justify-between gap-x-2': isDefault,
                  'bg-background-4': isSelected,
                  'pl-7': !isSelected
                })}
                onClick={() => selectBranch(item)}
                key={item.name}
              >
                <div className="flex w-full min-w-0 items-center gap-x-2">
                  {isSelected && <Icon name="tick" size={12} className="min-w-[12px] text-foreground-1" />}
                  <Text
                    className={cn('text-foreground-2', {
                      'text-foreground-1': isSelected
                    })}
                    truncate
                  >
                    {item.name}
                  </Text>
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
                    Default
                  </Badge>
                )}
              </DropdownMenuItem>
            )
          })}
        </div>

        <DropdownMenuItem className="p-0" asChild>
          <div className="mt-1 border-t border-borders-4 px-3 py-2">
            <Link to={viewAllUrl}>
              <Text className="leading-none text-ring transition-colors duration-200 hover:text-foreground-1">
                View all {activeTab === BranchSelectorTab.BRANCHES ? 'branches' : 'tags'}
              </Text>
            </Link>
          </div>
        </DropdownMenuItem>
      </div>
    </DropdownMenuContent>
  )
}
