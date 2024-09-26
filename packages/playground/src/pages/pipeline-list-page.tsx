import React, { useState } from 'react'
import {
  Text,
  Spacer,
  ListActions,
  ListPagination,
  Button,
  SearchBox,
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationEllipsis,
  PaginationNext
} from '@harnessio/canary'
import { PipelineList } from '../components/pipeline-list'
import { PaddingListLayout } from '../layouts/PaddingListLayout'
import { SkeletonList } from '../components/loaders/skeleton-list'
import { NoSearchResults } from '../components/no-search-results'
import { NoData } from '../components/no-data'
import { PlaygroundListSettings } from '../settings/list-settings'
import { Link } from 'react-router-dom'
import { mockPipelines } from '../data/mockPipelinesData'

const filterOptions = [{ name: 'Filter option 1' }, { name: 'Filter option 2' }, { name: 'Filter option 3' }]
const sortOptions = [{ name: 'Sort option 1' }, { name: 'Sort option 2' }, { name: 'Sort option 3' }]
const viewOptions = [{ name: 'View option 1' }, { name: 'View option 2' }]

function PipelineListPage() {
  const [loadState, setLoadState] = useState('data-loaded')

  const LinkComponent = ({ to, children }: { to: string; children: React.ReactNode }) => <Link to={to}>{children}</Link>

  const renderListContent = () => {
    switch (loadState) {
      case 'data-loaded':
        return <PipelineList pipelines={mockPipelines} LinkComponent={LinkComponent} />
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
          iconName="no-data-folder"
          title="No pipelines yet"
          description={['There are no pipelines yet.', 'Create new or import an existing pipeline.']}
          primaryButton={{ label: 'Create pipeline' }}
          secondaryButton={{ label: 'Import pipeline' }}
        />
        <PlaygroundListSettings loadState={loadState} setLoadState={setLoadState} />
      </>
    )
  }

  return (
    <>
      <PaddingListLayout>
        <Text size={5} weight={'medium'}>
          Pipelines
        </Text>
        <Spacer size={6} />
        <ListActions.Root>
          <ListActions.Left>
            <SearchBox.Root placeholder="Search pipelines" />
          </ListActions.Left>
          <ListActions.Right>
            <ListActions.Dropdown title="Filter" items={filterOptions} />
            <ListActions.Dropdown title="Sort" items={sortOptions} />
            <ListActions.Dropdown title="View" items={viewOptions} />
            <Button variant="default" asChild>
              <Link to="create">Create Pipeline</Link>
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

export default PipelineListPage
