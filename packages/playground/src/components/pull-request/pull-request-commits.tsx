import React, { useMemo } from 'react'
import { mockCommitData } from './mocks/mockCommitData'
import {
  ListPagination,
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@harnessio/canary'
import { TypesCommit } from './interfaces'
import CommitListItem from '../commit-list-item'
import { formatDate } from '../../utils/utils'

export default function PullRequestCommits() {
  const data = mockCommitData
  const commitsGroupedByDate: Record<string, TypesCommit[]> = useMemo(
    () =>
      data?.reduce(
        (group, commit) => {
          const date = formatDate(commit.committer?.when as string)
          group[date] = (group[date] || []).concat(commit)
          return group
        },
        {} as Record<string, TypesCommit[]>
      ) || {},
    [data]
  )
  return (
    <div>
      {Object.entries(commitsGroupedByDate).map(([date, commitData]) => (
        <CommitListItem header={date} commitData={commitData} />
      ))}
      {/* TODO: actually add pagination when apis are implemented */}
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
    </div>
  )
}
