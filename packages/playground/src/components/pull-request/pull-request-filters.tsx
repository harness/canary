import {
  Text,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  Button,
  Icon
} from '@harnessio/canary'
import React from 'react'

interface FilterOption {
  label: string
  value: string
}

export interface PullRequestFilterProps<T extends FilterOption> {
  activityFilters: T[]
  dateFilters: T[]
  activityFilter: T
  dateOrderSort: T
  setActivityFilter: (filter: T) => void
  setDateOrderSort: (sort: T) => void
}

const PullRequestFilters = <T extends FilterOption>({
  activityFilters,
  dateFilters,
  activityFilter,
  dateOrderSort,
  setActivityFilter,
  setDateOrderSort
}: PullRequestFilterProps<T>) => {
  return (
    <div className="pb-3 grid grid-cols-[1fr_auto] items-center border-b">
      <Text size={4} weight="medium">
        Overview
      </Text>
      <div className="flex gap-4 items-center">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant="ghost" size="default" padding="sm" className="entity-list-action">
              {activityFilter.label}&nbsp;
              <Icon name="chevron-down" size={12} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {activityFilters.map(filter => (
              <DropdownMenuItem key={filter.value} onClick={() => setActivityFilter(filter)}>
                {filter.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant="ghost" size="default" padding="sm" className="entity-list-action">
              {dateOrderSort.label}&nbsp;
              <Icon name="chevron-down" size={12} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {dateFilters.map(filter => (
              <DropdownMenuItem key={filter.value} onClick={() => setDateOrderSort(filter)}>
                {filter.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

export default PullRequestFilters
