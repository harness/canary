import { useCallback, useMemo, useRef } from 'react'

import { CounterBadge, DropdownMenu, Text, TimeAgoCard } from '@harnessio/ui/components'

import { CommitFilterItemProps } from './pull-request-changes-filter'

export type SinceLastReviewStatus = 'no-review' | 'no-new-commits' | 'has-new-commits'

export interface SinceLastReviewData {
  status: SinceLastReviewStatus
  commits: CommitFilterItemProps[]
}

export interface ChainedCommitsDropdownProps {
  commitFilterOptions: CommitFilterItemProps[]
  selectedCommits: CommitFilterItemProps[]
  setSelectedCommits: React.Dispatch<React.SetStateAction<CommitFilterItemProps[]>>
  defaultCommitFilter: CommitFilterItemProps
  sinceLastReview?: SinceLastReviewData
}

export function ChainedCommitsDropdown(props: ChainedCommitsDropdownProps) {
  const { commitFilterOptions, defaultCommitFilter, selectedCommits, setSelectedCommits, sinceLastReview } = props

  const shiftKeyDownRef = useRef(false)

  const isChangedSinceLastReviewSelected = useMemo(() => {
    if (sinceLastReview?.status !== 'has-new-commits') return false
    const commits = sinceLastReview.commits
    if (selectedCommits.length !== commits.length) return false
    return commits.every(c => selectedCommits.some(s => s.value === c.value))
  }, [sinceLastReview, selectedCommits])

  const handleCommitCheck = useCallback(
    (item: CommitFilterItemProps, checked: boolean, selectRange: boolean): void => {
      // If user clicked on 'All Commits', reset selection to just the default commit filter
      if (item.value === defaultCommitFilter.value) {
        setSelectedCommits([defaultCommitFilter])
        return
      }

      // Select All commits when unselect commit
      if (selectedCommits.length === 1 && selectedCommits[0].value === item.value) {
        setSelectedCommits([defaultCommitFilter])
        return
      }

      // Remove "All Commits"
      const newSelection = selectedCommits.filter(sel => sel.value !== defaultCommitFilter.value)

      // Select single commit
      if (!selectRange || newSelection.length === 0) {
        newSelection.push(item)
        setSelectedCommits([item])
        return
      }

      // Select range
      const formIdx = commitFilterOptions.findIndex(currItem => currItem.value === newSelection[0].value)
      const toIdx = commitFilterOptions.findIndex(currItem => currItem.value === item.value)
      const range = toIdx > formIdx ? { start: formIdx, end: toIdx } : { start: toIdx, end: formIdx }
      const newRangeSelection = commitFilterOptions.slice(range.start, range.end + 1)
      setSelectedCommits(newRangeSelection)
    },
    [commitFilterOptions, defaultCommitFilter, selectedCommits, setSelectedCommits]
  )

  const renderSinceLastReviewOption = () => {
    if (!sinceLastReview) return null

    const { status, commits } = sinceLastReview

    if (status === 'no-review' || status === 'no-new-commits') {
      return (
        <>
          <DropdownMenu.CheckboxItem
            title={<Text>Changes since your last review</Text>}
            description={
              status === 'no-review' ? 'No previous reviews found' : 'No new commits since last review'
            }
            checked={false}
            disabled
          />
          <DropdownMenu.Separator />
        </>
      )
    }

    return (
      <>
        <DropdownMenu.CheckboxItem
          title={
            <div className="flex items-center gap-cn-md overflow-hidden">
              <Text>Changes since your last review</Text>
              <CounterBadge>{commits.length}</CounterBadge>
            </div>
          }
          checked={isChangedSinceLastReviewSelected}
          onCheckedChange={() => {
            if (isChangedSinceLastReviewSelected) {
              setSelectedCommits([defaultCommitFilter])
            } else {
              setSelectedCommits(commits)
            }
          }}
        />
        <DropdownMenu.Separator />
      </>
    )
  }

  return (
    <DropdownMenu.Content className="max-w-max" align="start">
      {commitFilterOptions.map((item, idx) => {
        const isSelected = selectedCommits.some(sel => sel.value === item.value)
        const isAllCommitsOption = item.value === defaultCommitFilter.value

        return (
          <>
            <DropdownMenu.CheckboxItem
              title={
                <div className="flex gap-cn-md overflow-hidden">
                  <Text truncate className="w-72">
                    {item.name}
                  </Text>
                  {item.datetime && (
                    <TimeAgoCard timestamp={item.datetime} textProps={{ className: 'whitespace-nowrap' }} />
                  )}
                </div>
              }
              checked={isSelected}
              key={idx}
              onMouseUp={e => {
                shiftKeyDownRef.current = e.shiftKey
              }}
              onCheckedChange={checked => {
                handleCommitCheck(item, checked, shiftKeyDownRef.current)
              }}
            />
            {isAllCommitsOption && renderSinceLastReviewOption()}
          </>
        )
      })}
      <DropdownMenu.Footer>
        <Text>Shift-click to select a range</Text>
      </DropdownMenu.Footer>
    </DropdownMenu.Content>
  )
}
