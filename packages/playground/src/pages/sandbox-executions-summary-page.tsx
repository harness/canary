import { useState } from 'react'
import { Link } from 'react-router-dom'

import { ListActions, SearchBox, Spacer, Text } from '@harnessio/canary'
import { SkeletonList } from '@harnessio/ui/components'

import { SandboxLayout } from '..'
import { ExecutionList } from '../components/execution-list'
import { NoData } from '../components/no-data'
import { NoSearchResults } from '../components/no-search-results'
import { PaginationComponent } from '../components/pagination'
import { PlaygroundListSettings } from '../settings/list-settings'
import { mockExecutions } from './mocks/execution/mockExecutionList'

const filterOptions = [{ name: 'Filter option 1' }, { name: 'Filter option 2' }, { name: 'Filter option 3' }]
const sortOptions = [{ name: 'Sort option 1' }, { name: 'Sort option 2' }, { name: 'Sort option 3' }]
const viewOptions = [{ name: 'View option 1' }, { name: 'View option 2' }]

function SandboxExecutionSummaryPage() {
  const [loadState, setLoadState] = useState('data-loaded')

  const LinkComponent = ({ to, children }: { to: string; children: React.ReactNode }) => <Link to={to}>{children}</Link>

  const renderListContent = () => {
    switch (loadState) {
      case 'data-loaded':
        return <ExecutionList executions={mockExecutions} LinkComponent={LinkComponent} />
      case 'loading':
        return <SkeletonList />
      case 'no-data':
        return (
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
        )
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

  return (
    <SandboxLayout.Main hasHeader hasSubHeader hasLeftPanel>
      <SandboxLayout.Content>
        <Spacer size={4} />
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
      </SandboxLayout.Content>
      <PlaygroundListSettings loadState={loadState} setLoadState={setLoadState} />
    </SandboxLayout.Main>
  )
}

export { SandboxExecutionSummaryPage }
