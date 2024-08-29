import React, { useState } from 'react'
import PlaygroundPullRequestChangesSettings from '../components/playground/pull-request-changes-settings'
import SkeletonList from '../components/loaders/skeleton-list'
import NoData from '../components/no-data'
import { ListActions, Spacer, SplitButton } from '@harnessio/canary'
import PullRequestChanges from '../components/pull-request/pull-request-changes'

const FilterSortViewDropdowns: React.FC = () => {
  const filterOptions = [{ name: 'Filter option 1' }, { name: 'Filter option 2' }, { name: 'Filter option 3' }]
  const sortOptions = [{ name: 'Sort option 1' }, { name: 'Sort option 2' }, { name: 'Sort option 3' }]
  const viewOptions = [{ name: 'View option 1' }, { name: 'View option 2' }]

  return (
    <ListActions.Root>
      <ListActions.Left>
        <ListActions.Dropdown title="All commits" items={filterOptions} />
        <ListActions.Dropdown title="File filter" items={sortOptions} />
        <ListActions.Dropdown title="View" items={viewOptions} />
      </ListActions.Left>
      <ListActions.Right>
        <SplitButton variant="outline" size="sm">
          Approve
        </SplitButton>
      </ListActions.Right>
    </ListActions.Root>
  )
}

export default function PullRequestChangesPage() {
  const [loadState, setLoadState] = useState('data-loaded') // Change to data-loaded when component work is finished

  const pullRequestData = [
    'All checks have succeeded',
    'New commit pushed',
    'Conflicts resolved',
    'All checks have succeeded',
    'New commit pushed',
    'Conflicts resolved',
    'All checks have succeeded',
    'New commit pushed',
    'Conflicts resolved'
  ]

  const renderContent = () => {
    switch (loadState) {
      case 'data-loaded':
        return <PullRequestChanges data={pullRequestData} />
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
      {loadState == 'data-loaded' && (
        <>
          <FilterSortViewDropdowns />
          <Spacer aria-setsize={5} />
        </>
      )}

      {renderContent()}
      <PlaygroundPullRequestChangesSettings loadState={loadState} setLoadState={setLoadState} />
    </>
  )

  return null
}
