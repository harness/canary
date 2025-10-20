import { useCallback, useRef } from 'react'

import { DropdownMenu, Text, TimeAgoCard } from '@components/index'

import { CommitFilterItemProps } from './pull-request-changes-filter'

export interface ChainedCommitsDropdownProps {
  commitFilterOptions: CommitFilterItemProps[]
  selectedCommits: CommitFilterItemProps[]
  setSelectedCommits: React.Dispatch<React.SetStateAction<CommitFilterItemProps[]>>
  defaultCommitFilter: CommitFilterItemProps
}

export function ChainedCommitsDropdown(props: ChainedCommitsDropdownProps) {
  const { commitFilterOptions, defaultCommitFilter, selectedCommits, setSelectedCommits } = props

  const shiftKeyDownRef = useRef(false)

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

  return (
    <DropdownMenu.Content className="max-auto" align="start">
      {commitFilterOptions.map((item, idx) => {
        const isSelected = selectedCommits.some(sel => sel.value === item.value)

        return (
          <DropdownMenu.CheckboxItem
            title={
              <div className="flex gap-cn-md overflow-hidden">
                <Text truncate className="w-72">
                  {item.name}
                </Text>
                {item.datetime && (
                  <TimeAgoCard
                    timestamp={item.datetime}
                    textProps={{ className: 'whitespace-nowrap' }}
                    cutoffDays={365}
                    dateTimeFormatOptions={{ dateStyle: 'medium' }}
                  />
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
        )
      })}
      <DropdownMenu.Footer>
        <Text>Shift-click to select a range</Text>
      </DropdownMenu.Footer>
    </DropdownMenu.Content>
  )
}
