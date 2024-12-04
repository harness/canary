import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Icon,
  Text
} from '@harnessio/canary'

interface DropdownButtonProps {
  label: string
  onClick: () => void
}

const DropdownButton: React.FC<DropdownButtonProps> = ({ label, onClick }) => {
  return (
    <Button variant="ghost" size="default" padding="sm" className="entity-list-action font-normal" onClick={onClick}>
      {label}&nbsp;
      <Icon name="chevron-down" size={12} className="chevron-down" />
    </Button>
  )
}

interface DropdownMenuComponentProps<T> {
  items: T[]
  selectedItem: T
  onItemSelect: (item: T) => void
}

const DropdownMenuComponent = <T extends { label: string; value: string }>({
  items,
  selectedItem,
  onItemSelect
}: DropdownMenuComponentProps<T>) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <DropdownButton label={selectedItem.label} onClick={() => {}} />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {items.map(item => (
          <DropdownMenuItem key={item.value} onClick={() => onItemSelect(item)}>
            {item.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

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
    <div className="grid grid-cols-[1fr_auto] items-center border-b pb-2">
      <Text size={4} weight="medium">
        Overview
      </Text>
      <div className="flex items-center gap-4">
        <DropdownMenuComponent items={activityFilters} selectedItem={activityFilter} onItemSelect={setActivityFilter} />
        <DropdownMenuComponent items={dateFilters} selectedItem={dateOrderSort} onItemSelect={setDateOrderSort} />
      </div>
    </div>
  )
}

export { PullRequestFilters }
