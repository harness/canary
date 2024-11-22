import { useState } from 'react'
import { Link } from 'react-router-dom'

import { noop } from 'lodash-es'

import { Button, ListActions, SearchBox, Spacer, Text } from '@harnessio/canary'

import { TopBarWidget } from '../components/layout/top-bar-widget'
import { SkeletonList } from '../components/loaders/skeleton-list'
import { NoData } from '../components/no-data'
import { NoSearchResults } from '../components/no-search-results'
import { PaginationComponent } from '../components/pagination'
import { RepoList } from '../components/repo-list'
import { mockProjects } from '../data/mockProjects'
import { mockRepos } from '../data/mockReposData'
import { PaddingListLayout } from '../layouts/PaddingListLayout'
import { PlaygroundListSettings } from '../settings/list-settings'

const filterOptions = [{ name: 'Filter option 1' }, { name: 'Filter option 2' }, { name: 'Filter option 3' }]
const sortOptions = [{ name: 'Sort option 1' }, { name: 'Sort option 2' }, { name: 'Sort option 3' }]

function RepoListPage() {
  const [loadState, setLoadState] = useState('data-loaded')

  const LinkComponent = ({ to, children }: { to: string; children: React.ReactNode }) => (
    <Link to={`/repos/${to}`}>{children}</Link>
  )

  const renderListContent = () => {
    switch (loadState) {
      case 'data-loaded':
        return <RepoList repos={mockRepos} LinkComponent={LinkComponent} />
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

  if (loadState === 'no-data') {
    return (
      <>
        <NoData
          iconName="no-repository"
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
      <TopBarWidget projects={mockProjects} onSelectProject={noop} />
      <PaddingListLayout>
        <Text size={5} weight={'medium'}>
          Repositories
        </Text>
        <Spacer size={6} />
        <ListActions.Root>
          <ListActions.Left>
            <SearchBox.Root placeholder="Search repositories" />
          </ListActions.Left>
          <ListActions.Right>
            <ListActions.Dropdown title="Filter" items={filterOptions} />
            <ListActions.Dropdown title="Sort" items={sortOptions} />
            <Button variant="default">New repository</Button>
          </ListActions.Right>
        </ListActions.Root>
        <Spacer className="mt-[1.125rem]" />
        {renderListContent()}
        <Spacer size={6} />
        {loadState === 'data-loaded' && <PaginationComponent totalPages={10} currentPage={5} goToPage={() => {}} />}
      </PaddingListLayout>
      <PlaygroundListSettings loadState={loadState} setLoadState={setLoadState} />
    </>
  )
}

export default RepoListPage
