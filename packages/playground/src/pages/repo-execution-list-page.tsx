import React, { useState } from 'react'
import {
  Spacer,
  ListActions,
  ListPagination,
  SearchBox,
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationEllipsis,
  PaginationNext,
  Button,
  Text
} from '@harnessio/canary'
import { ExecutionList } from '../components/execution-list'
import { Link } from 'react-router-dom'
import { PaddingListLayout } from '../layouts/PaddingListLayout'
import { SkeletonList } from '../components/loaders/skeleton-list'
import { NoSearchResults } from '../components/no-search-results'
import { NoData } from '../components/no-data'
import { PlaygroundListSettings } from '../settings/list-settings'

const mockExecutions = [
  {
    id: '1',
    number: 733,
    name: 'removing duplicated metrics for servers and swapping to pattern math…',
    sha: '93dbd09a',
    description: 'fix(deps): update module github.com/aws/aws-sdk-go to',
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

function RepoExecutionListPage() {
  const [loadState, setLoadState] = useState('data-loaded')

  const LinkComponent = ({ to, children }: { to: string; children: React.ReactNode }) => (
    <Link to={`executions/${to}`}>{children}</Link>
  )

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
          insideTabView
          iconName="no-data-folder"
          title="No executions yet"
          description={['There are no executions in this pipeline yet.']}
          primaryButton={{ label: 'Create pipeline' }}
          secondaryButton={{ label: 'Import pipeline' }}
        />
        <PlaygroundListSettings loadState={loadState} setLoadState={setLoadState} />
      </>
    )
  }

  return (
    <>
      <PaddingListLayout spaceTop={false}>
        <Spacer size={2} />
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
            <Button variant="default" asChild>
              <Link to="edit">Edit Pipeline</Link>
            </Button>
          </ListActions.Right>
        </ListActions.Root>
        <Spacer size={5} />
        {renderListContent()}
        <Spacer size={8} />
        {loadState == 'data-loaded' && (
          <ListPagination.Root>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious size="sm" href="#" />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink isActive size="sm_icon" href="#">
                    1
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink size="sm_icon" href="#">
                    2
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink size="sm_icon" href="#">
                    4
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink size="sm_icon" href="#">
                    5
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext size="sm" href="#" />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </ListPagination.Root>
        )}
      </PaddingListLayout>
      <PlaygroundListSettings loadState={loadState} setLoadState={setLoadState} />
    </>
  )
}

export default RepoExecutionListPage
