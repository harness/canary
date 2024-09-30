import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Text, Spacer, ListActions, SearchBox } from '@harnessio/canary'
import { ExecutionList } from '../components/execution-list'
import { PaginationComponent } from '../components/pagination'

import { SkeletonList } from '../components/loaders/skeleton-list'
import { NoSearchResults } from '../components/no-search-results'
import { NoData } from '../components/no-data'
import { PlaygroundListSettings } from '../settings/list-settings'
import { SandboxLayout } from '..'

const mockExecutions = [
  {
    id: '1',
    number: 733,
    success: true,
    name: 'removing duplicated metrics for servers and swapping to pattern math…',
    sha: '93dbd09a',
    description: 'fix(deps): update module github.com/aws/aws-sdk-go to',
    version: 'v1.5.4.20',
    timestamp: '7 days ago',
    lastTimestamp: '11:24'
  },
  {
    id: '2',
    number: 732,
    success: true,
    name: '(fix) CI-9642 update go version, remove cli warning messages',
    sha: '366177a6',
    description: 'Update module github.com/aws/aws-sdk-go to',
    version: 'v1.54.19',
    timestamp: '4 months ago',
    lastTimestamp: '11:20'
  },
  {
    id: '3',
    number: 731,
    success: true,
    name: 'Bump github.com/containerd/containerd from 1.6.8 to 1.6.18',
    sha: 'da7c1c67',
    description: 'feat: [CDE-119]: Add task handling to spawn and cleanup VM for CDE/gitspaces on bare metalo',
    version: 'v1.5.4.20',
    timestamp: '7 months ago',
    lastTimestamp: '10:50'
  },
  {
    id: '4',
    number: 730,
    success: true,
    name: '(fix) setup dependencies in drone build',
    sha: '93dbd09a',
    description: 'fix: [CI-13371]: Fix log closers in case of step timeouts',
    version: 'v1.5.4.20',
    timestamp: '7 months ago',
    lastTimestamp: '04:12'
  },

  {
    id: '5',
    number: 729,
    success: false,
    name: 'Add support for jpath in jsonnet (#224) * Add support for jpath in jsonnet Co-a',
    sha: 'fe54f9b1',
    description: 'Update go-jsonnet version to',
    version: 'v0.20.0',
    timestamp: '7 months ago',
    lastTimestamp: '05:36'
  },
  {
    id: '6',
    number: 728,
    success: true,
    name: 'fix: use right parameter name for secrets-file',
    sha: 'b7765ad1',
    description: 'update google/go-jsonnet version to',
    version: 'v0.20.0',
    timestamp: '10 months ago',
    lastTimestamp: '04:06'
  }
]

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
        {loadState == 'data-loaded' && (
          <PaginationComponent
            totalPages={10}
            currentPage={5}
            nextPage={() => {}}
            previousPage={() => {}}
            handleClick={() => {}}
          />
        )}
      </SandboxLayout.Content>
      <PlaygroundListSettings loadState={loadState} setLoadState={setLoadState} />
    </SandboxLayout.Main>
  )
}

export { SandboxExecutionSummaryPage }
