import { useState } from 'react'

import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Icon,
  ListActions,
  RadioGroup,
  RadioGroupItem,
  Spacer,
  Text
} from '@harnessio/canary'
import { SkeletonList } from '@harnessio/ui/components'

import { FileViewGauge } from '..'
import { NoData } from '../components/no-data'
import { PullRequestChanges } from '../components/pull-request/pull-request-changes'
import { mockDiffData } from '../data/mockDiffData'
import PlaygroundPullRequestChangesSettings from '../settings/pull-request-changes-settings'

interface FilterViewProps {
  active: string
}

const mockApprovalItems = [
  {
    stateId: 0,
    state: 'success',
    title: 'Approve',
    items: [
      {
        id: 0,
        title: 'This is a title',
        description: 'This is a description'
      },
      {
        id: 1,
        title: 'This is title 2',
        description: 'This is description 2'
      },
      {
        id: 2,
        title: 'This is title 3',
        description: 'This is description 3'
      }
    ]
  },
  {
    stateId: 1,
    state: 'warning',
    title: 'Approve',
    items: [
      { id: 0, title: 'This is a title', description: 'This is a description' },
      {
        id: 1,
        title: 'This is title 2',
        description: 'This is description 2'
      },
      {
        id: 2,
        title: 'This is title 3',
        description: 'This is description 3'
      }
    ]
  },
  {
    stateId: 2,
    state: 'error',
    title: 'Approve',
    items: [
      {
        id: 0,
        title: 'This is a title',
        description: 'This is a description'
      },
      {
        id: 1,
        title: 'This is title 2',
        description: 'This is description 2'
      },
      {
        id: 2,
        title: 'This is title 3',
        description: 'This is description 3'
      }
    ]
  }
]

const filesViewed = {
  total: 3,
  viewed: 1
}

const FilterSortViewDropdowns: React.FC<FilterViewProps> = ({ active }) => {
  const filterOptions = [{ name: 'Filter option 1' }, { name: 'Filter option 2' }, { name: 'Filter option 3' }]
  const sortOptions = [{ name: 'Sort option 1' }, { name: 'Sort option 2' }, { name: 'Sort option 3' }]
  const viewOptions = [{ name: 'View option 1' }, { name: 'View option 2' }]

  const index = (() => {
    switch (active) {
      case 'data-loaded-warning':
        return 1
      case 'data-loaded-error':
        return 2
      default:
        return 0
    }
  })()

  return (
    <ListActions.Root>
      <ListActions.Left>
        <ListActions.Dropdown title="All commits" items={filterOptions} />
        <ListActions.Dropdown title="File filter" items={sortOptions} />
        <ListActions.Dropdown title="View" items={viewOptions} />
      </ListActions.Left>
      <ListActions.Right>
        <FileViewGauge.Root>
          <FileViewGauge.Content>
            {filesViewed.viewed}/{filesViewed.total} file{filesViewed.total === 1 ? '' : 's'} viewed
          </FileViewGauge.Content>
          <FileViewGauge.Bar total={filesViewed.total} filled={filesViewed.viewed} />
        </FileViewGauge.Root>
        <Button
          variant="split"
          size="xs_split"
          theme={mockApprovalItems[index].state}
          dropdown={
            <DropdownMenu>
              <DropdownMenuTrigger insideSplitButton>
                <Icon name="chevron-down" size={11} className="chevron-down" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="mt-1">
                <DropdownMenuGroup>
                  {mockApprovalItems &&
                    mockApprovalItems[index].items.map(itm => (
                      <DropdownMenuItem key={itm.id}>
                        <RadioGroup className="flex items-start gap-2">
                          <RadioGroupItem value="false" className="text-tertiary-background mt-1 size-3" />
                          <div className="flex flex-col">
                            <Text truncate size={1} color="primary">
                              {itm.title}
                            </Text>
                            <Text size={1} color="tertiaryBackground">
                              {itm.description}
                            </Text>
                          </div>
                        </RadioGroup>
                      </DropdownMenuItem>
                    ))}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          }
        >
          {mockApprovalItems[index].title}
        </Button>
      </ListActions.Right>
    </ListActions.Root>
  )
}

export default function PullRequestChangesPage() {
  const [loadState, setLoadState] = useState('data-loaded-success') // Updated loadState default to prevent infinite render

  const renderContent = () => {
    switch (loadState) {
      case 'data-loaded-success':
      case 'data-loaded-warning':
      case 'data-loaded-error':
        return <PullRequestChanges data={mockDiffData} />
      case 'loading':
        return <SkeletonList />
      case 'no-data':
        return (
          <NoData
            iconName="no-data-folder"
            title="No changes yet"
            description={['There are no changes for this pull request yet.']}
          />
        )
      default:
        return null
    }
  }

  return (
    <>
      {loadState.startsWith('data-loaded-') && (
        <>
          <FilterSortViewDropdowns active={loadState} />
          <Spacer aria-setsize={5} />
        </>
      )}
      {renderContent()}
      <PlaygroundPullRequestChangesSettings loadState={loadState} setLoadState={setLoadState} />
    </>
  )
}
