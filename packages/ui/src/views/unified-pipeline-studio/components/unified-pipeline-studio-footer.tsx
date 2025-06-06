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
        'bg-grey-6 text-grey-60 border-cn-borders-3 flex h-10 shrink-0 items-center justify-between border-t px-4 text-[12px] font-normal not-italic leading-[15px]'
      }
    >
      <div className="flex items-center gap-2">
        <div
          role="button"
          tabIndex={0}
          onClick={() => {
            togglePane?.()
          }}
          className="hover:bg-cn-background-accent/10 flex h-full cursor-pointer gap-2.5 rounded-md px-2 py-1.5 duration-150 ease-in-out"
        >
          <div className="flex items-center gap-1.5">
            <IconV2
              size={14}
              name="xmark-circle"
              className={problemsCount.error > 0 ? 'text-cn-foreground-danger' : 'text-cn-foreground-3'}
            />
            <span
              className={cn(
                'text-[12px]',
                problemsCount.error > 0 ? 'text-cn-foreground-danger' : 'text-cn-foreground-1'
              )}
            >
              {problemsCount.error}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <IconV2 size={14} name="warning-triangle" className="text-cn-foreground-3" />
            <span className="text-cn-foreground-1 text-[12px]">{problemsCount.warning}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <IconV2 size={14} name="info-circle" className="text-cn-foreground-3" />
            <span className="text-cn-foreground-1 text-[12px]">{problemsCount.info}</span>
          </div>
        </div>
        {(branchesLoading || branches || currentBranch) && (
          <div className={'flex gap-2'}>
            <div className={'flex items-center'}>
              <span className="text-cn-foreground-3 text-[12px]">Branch:</span>

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
            <div className="text-cn-foreground-3 flex text-[12px]">
              Last edited
              <span className="text-cn-foreground-1">&nbsp;{committedTimeAgo}&nbsp;</span> by
              <span className="text-cn-foreground-1">&nbsp;{authorName}&nbsp;</span>
            </div>
          </Popover.Trigger>
          <Popover.Content side={'top'} className="mb-4 mr-4 w-80 p-0">
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
