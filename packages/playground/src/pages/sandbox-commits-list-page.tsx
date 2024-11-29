import { useState } from 'react'
import { Link } from 'react-router-dom'

import { noop } from 'lodash-es'

import { ListActions, Spacer, Text } from '@harnessio/canary'
import { SkeletonList } from '@harnessio/ui/components'

import { SandboxLayout } from '..'
import { BranchSelector } from '../components/branch-chooser'
import CommitsList from '../components/commits-list'
import { NoData } from '../components/no-data'
import { PaginationComponent } from '../components/pagination'
import { mockRepos } from '../data/mockReposData'
import PlaygroundCommitsSettings from '../settings/commits-settings'

const filterOptions = [{ name: 'Filter option 1' }, { name: 'Filter option 2' }, { name: 'Filter option 3' }]
const sortOptions = [{ name: 'Sort option 1' }, { name: 'Sort option 2' }, { name: 'Sort option 3' }]

const mockBranchList = [
  {
    name: 'main'
  },
  {
    name: 'new-feature'
  },
  {
    name: 'test-wip'
  },
  {
    name: 'display-db'
  }
]

export default function SandboxCommitsListPage() {
  const [loadState, setLoadState] = useState('data-loaded')

  const LinkComponent = ({ to, children }: { to: string; children: React.ReactNode }) => (
    <Link to={`/repos/${to}`}>{children}</Link>
  )

  const renderContent = () => {
    switch (loadState) {
      case 'data-loaded':
        return <CommitsList repos={mockRepos} LinkComponent={LinkComponent} />
      case 'loading':
        return <SkeletonList />

      default:
        return null
    }
  }

  if (loadState == 'no-data') {
    return (
      <>
        <NoData iconName="no-data-folder" title="No commits yet" description={['There are no commits yet.']} />
        <PlaygroundCommitsSettings loadState={loadState} setLoadState={setLoadState} />
      </>
    )
  }
  return (
    <SandboxLayout.Main hasHeader hasLeftPanel hasSubHeader>
      <SandboxLayout.Content>
        <Spacer size={2} />
        <Text size={5} weight={'medium'}>
          Commits
        </Text>
        <Spacer size={6} />
        <ListActions.Root>
          <ListActions.Left>
            <BranchSelector name={'main'} branchList={mockBranchList} selectBranch={noop} />
          </ListActions.Left>
          <ListActions.Right>
            <ListActions.Dropdown title="Filter" items={filterOptions} />
            <ListActions.Dropdown title="Sort" items={sortOptions} />
          </ListActions.Right>
        </ListActions.Root>
        <Spacer size={5} />
        {renderContent()}
        <Spacer size={8} />
        {loadState === 'data-loaded' && <PaginationComponent totalPages={10} currentPage={5} goToPage={() => {}} />}
        <PlaygroundCommitsSettings loadState={loadState} setLoadState={setLoadState} />
      </SandboxLayout.Content>
    </SandboxLayout.Main>
  )
}
