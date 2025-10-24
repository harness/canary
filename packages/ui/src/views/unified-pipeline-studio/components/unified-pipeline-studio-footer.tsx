import { useMemo } from 'react'

import { IconV2, Popover, Select } from '@/components'
import { cn } from '@utils/cn'

import { PopoverCommitInfo } from './unified-popover-commit-info'

interface PipelineStudioFooterProps {
  problemsCount: {
    error: number
    warning: number
    info: number
  }
  lastCommitInfo?: {
    committedTimeAgo: string
    authorName: string
    commitSha?: string
    commitMessage?: string
  }
  currentBranch?: string
  branches?: string[]
  branchesLoading?: boolean
  onBranchChange?: (branch: string) => void
  togglePane?: () => void
}

export const UnifiedPipelineStudioFooter: React.FC<PipelineStudioFooterProps> = (props: PipelineStudioFooterProps) => {
  const {
    currentBranch,
    branchesLoading,
    branches,
    lastCommitInfo: { committedTimeAgo, authorName, commitSha, commitMessage } = {},
    onBranchChange,
    togglePane,
    problemsCount
  } = props

  const branchOptions = useMemo(() => branches?.map(branch => ({ value: branch, label: branch })) ?? [], [branches])

  return (
    <footer
      className={
        'flex h-10 shrink-0 items-center justify-between border-t border-cn-3 px-4 text-[12px] font-normal not-italic leading-[15px]'
      }
    >
      <div className="flex items-center gap-2">
        <div
          role="button"
          tabIndex={0}
          onClick={() => {
            togglePane?.()
          }}
          className="flex h-full cursor-pointer gap-2.5 rounded-md px-2 py-1.5 duration-150 ease-in-out hover:bg-cn-brand-hover/10"
        >
          <div className="flex items-center gap-1.5">
            <IconV2
              size="xs"
              name="xmark-circle"
              className={problemsCount.error > 0 ? 'text-cn-danger' : 'text-cn-3'}
            />
            <span className={cn('text-[12px]', problemsCount.error > 0 ? 'text-cn-danger' : 'text-cn-1')}>
              {problemsCount.error}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <IconV2 size="xs" name="warning-triangle" className="text-cn-3" />
            <span className="text-[12px] text-cn-1">{problemsCount.warning}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <IconV2 size="xs" name="info-circle" className="text-cn-3" />
            <span className="text-[12px] text-cn-1">{problemsCount.info}</span>
          </div>
        </div>
        {(branchesLoading || branches || currentBranch) && (
          <div className={'flex gap-2'}>
            <div className={'flex items-center'}>
              <span className="text-[12px] text-cn-3">Branch:</span>

              <Select
                options={branchOptions}
                value={currentBranch}
                disabled={branchesLoading}
                onChange={onBranchChange}
              />
            </div>
          </div>
        )}
      </div>
      {committedTimeAgo && authorName && (
        <Popover.Root>
          <Popover.Trigger>
            <div className="flex text-[12px] text-cn-3">
              Last edited
              <span className="text-cn-1">&nbsp;{committedTimeAgo}&nbsp;</span> by
              <span className="text-cn-1">&nbsp;{authorName}&nbsp;</span>
            </div>
          </Popover.Trigger>
          <Popover.Content side="top" className="mb-4 mr-4 w-80 p-0">
            <PopoverCommitInfo.Root>
              <PopoverCommitInfo.CommitInfo authorName={authorName} commit={commitSha} />
              <PopoverCommitInfo.CommitMessage>{commitMessage}</PopoverCommitInfo.CommitMessage>
            </PopoverCommitInfo.Root>
          </Popover.Content>
        </Popover.Root>
      )}
    </footer>
  )
}
