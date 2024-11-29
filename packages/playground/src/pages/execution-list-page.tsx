import { useState } from 'react'
import { Link } from 'react-router-dom'

import { noop } from 'lodash-es'

import { ListActions, SearchBox, Spacer, Text } from '@harnessio/canary'
import { SkeletonList } from '@harnessio/ui/components'

import { ExecutionList } from '../components/execution-list'
import { TopBarWidget } from '../components/layout/top-bar-widget'
import { NoData } from '../components/no-data'
import { NoSearchResults } from '../components/no-search-results'
import { PaginationComponent } from '../components/pagination'
import { mockProjects } from '../data/mockProjects'
import { PaddingListLayout } from '../layouts/PaddingListLayout'
import { PlaygroundListSettings } from '../settings/list-settings'
import { mockExecutions } from './mocks/execution/mockExecutionList'

const filterOptions = [{ name: 'Filter option 1' }, { name: 'Filter option 2' }, { name: 'Filter option 3' }]
const sortOptions = [{ name: 'Sort option 1' }, { name: 'Sort option 2' }, { name: 'Sort option 3' }]
const viewOptions = [{ name: 'View option 1' }, { name: 'View option 2' }]

function ExecutionListPage() {
  const [loadState, setLoadState] = useState('data-loaded')

  const LinkComponent = ({ to, children }: { to: string; children: React.ReactNode }) => <Link to={to}>{children}</Link>

  const renderListContent = () => {
    switch (loadState) {
      case 'data-loaded':
        return <ExecutionList executions={mockExecutions} LinkComponent={LinkComponent} />
      case 'loading':
        return <SkeletonList />
      case 'no-search-matches':
        return (
          <NoSearchResults
            iconName="no-search-magnifying-glass"
            title="No search results"
            description={['Check your spelling and filter options,', 'or search for a different keyword.']}
            primaryButton={{ label: 'Clear search' }}
            secondaryButton={{ label: 'Clear filters' }}
          />
        )
      default:
        return null
    }
  }

  if (loadState == 'no-data') {
    return (
      <>
        <NoData
          iconName="no-data-cog"
          title="No executions yet"
          description={[
            "Your pipeline executions will appear here once they're completed.",
            'Start your pipeline to see the results.'
          ]}
          primaryButton={{ label: 'Create pipeline' }}
          secondaryButton={{ label: 'Import pipeline' }}
        />
        <PlaygroundListSettings loadState={loadState} setLoadState={setLoadState} />
      </>
    )
  }

  return (
    <>
      <TopBarWidget projects={mockProjects} onSelectProject={noop} />
      <PaddingListLayout>
        <Text size={5} weight={'medium'}>
          Executions
        </Text>
        <Spacer size={6} />
        <ListActions.Root>
          <ListActions.Left>
            <SearchBox.Root placeholder="Search executions" />
          </ListActions.Left>
          <ListActions.Right>
            <ListActions.Dropdown title="Filter" items={filterOptions} />
            <ListActions.Dropdown title="Sort" items={sortOptions} />
            <ListActions.Dropdown title="View" items={viewOptions} />
          </ListActions.Right>
        </ListActions.Root>
        <Spacer size={5} />
        {renderListContent()}
        <Spacer size={8} />
        {loadState == 'data-loaded' && <PaginationComponent totalPages={10} currentPage={5} goToPage={() => {}} />}
      </PaddingListLayout>
      <PlaygroundListSettings loadState={loadState} setLoadState={setLoadState} />
    </>
  )
}

export default ExecutionListPage
