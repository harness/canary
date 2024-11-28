import { useState } from 'react'

import {
  ListPagination,
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  Spacer
} from '@harnessio/canary'
import { SkeletonList } from '@harnessio/ui/components'

import { NoData } from '../components/no-data'
import { PullRequestCommits } from '../components/pull-request/pull-request-commits'
import { mockCommitData } from '../data/mockCommitData'
import PlaygroundPullRequestCommitsSettings from '../settings/pull-request-commits-settings'

export default function PullRequestCommitsPage() {
  const [loadState, setLoadState] = useState('data-loaded')

  const renderContent = () => {
    switch (loadState) {
      case 'data-loaded':
        return <PullRequestCommits data={mockCommitData} />
      case 'loading':
        return <SkeletonList />
      case 'no-data':
        return (
          <NoData
            iconName="no-data-folder"
            title="No commits yet"
            description={['There are no commits for this pull request yet.']}
          />
        )
      default:
        return null
    }
  }

  return (
    <>
      {renderContent()}
      <Spacer size={8} />
      {/* TODO: actually add pagination when apis are implemented */}
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
      <PlaygroundPullRequestCommitsSettings loadState={loadState} setLoadState={setLoadState} />
    </>
  )
}
