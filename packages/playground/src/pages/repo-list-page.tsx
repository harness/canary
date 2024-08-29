import React, { useState } from 'react'
import RepoList from '../components/repo-list'
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
import PaddingListLayout from '../layouts/PaddingListLayout'
import PlaygroundListSettings from '../components/playground/list-settings'
import SkeletonList from '../components/loaders/skeleton-list'
import NoData from '../components/no-data'
import NoSearchResults from '../components/no-search-results'

const mockRepos = [
  {
    id: '1',
    name: 'drone',
    description: 'Continuous Integration platform powered by Docker',
    private: false,
    stars: 0,
    forks: 0,
    pulls: 12
  },
  {
    id: '2',
    name: 'drone-go',
    description: 'Go client for the Drone API',
    private: false,
    stars: 0,
    forks: 0,
    pulls: 5
  },
  {
    id: '3',
    name: 'go-generate',
    description: 'Package generate provides tools for generating pipeline configuration files in the Drone format.',
    private: true,
    stars: 2,
    forks: 1,
    pulls: 22
  },
  {
    id: '4',
    name: 'go-task',
    private: true,
    stars: 3,
    forks: 1,
    pulls: 7
  },
  {
    id: '5',
    name: 'go-scm',
    description: 'Package scm provides a unified interface to multiple source code management systems.',
    private: false,
    stars: 123,
    forks: 16,
    pulls: 56
  },
  {
    id: '6',
    name: 'go-convert',
    description: 'Package convert provides tools for converting pipeline configuration files to the Drone format.',
    private: true,
    stars: 8,
    forks: 0,
    pulls: 1
  },
  {
    id: '7',
    name: 'pixelpoint-generate',
    description: 'Package generate provides tools for generating pipeline configuration files in the Drone format.',
    private: true,
    stars: 54,
    forks: 1,
    pulls: 1
  },
  {
    id: '8',
    name: 'pixelpoint-scm',
    description: 'Package scm provides a unified interface to multiple source code management systems.',
    private: false,
    stars: 123,
    forks: 16,
    pulls: 56
  }
]

const filterOptions = [{ name: 'Filter option 1' }, { name: 'Filter option 2' }, { name: 'Filter option 3' }]
const sortOptions = [{ name: 'Sort option 1' }, { name: 'Sort option 2' }, { name: 'Sort option 3' }]

function RepoListPage() {
  const [loadState, setLoadState] = useState('data-loaded')

  const renderListContent = () => {
    switch (loadState) {
      case 'data-loaded':
        return <RepoList repos={mockRepos} />
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
          title="No repositories yet"
          description={[
            'There are no repositories in this project yet.',
            'Create new or import an existing repository.'
          ]}
          primaryButton={{ label: 'Create repository' }}
          secondaryButton={{ label: 'Import repository' }}
        />
        <PlaygroundListSettings loadState={loadState} setLoadState={setLoadState} />
      </>
    )
  }

  return (
    <>
      <PaddingListLayout>
        <Text size={5} weight={'medium'}>
          Repositories
        </Text>
        <Spacer size={6} />
        <ListActions.Root>
          <ListActions.Left>
            <SearchBox.Root placeholder="Search" />
          </ListActions.Left>
          <ListActions.Right>
            <ListActions.Dropdown title="Filter" items={filterOptions} />
            <ListActions.Dropdown title="Sort" items={sortOptions} />
            <Button variant="default">Create repository</Button>
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
                  <PaginationLink size="sm_icon" href="#">
                    <PaginationEllipsis />
                  </PaginationLink>
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

export default RepoListPage
