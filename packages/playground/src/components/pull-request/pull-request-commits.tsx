import React, { useMemo } from 'react'
import { TypesCommit } from './interfaces'
import CommitListItem from '../commit-list-item'
import { formatDate } from '../../utils/utils'

interface CommitProps {
  data?: TypesCommit[]
}

export default function PullRequestCommits({ ...props }: CommitProps) {
  const data = props.data
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
    </div>
  )
}
