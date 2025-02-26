import { Icon, Popover, Select } from '@/components'
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
    authorInitials?: string
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
    lastCommitInfo: { committedTimeAgo, authorName, authorInitials, commitSha, commitMessage } = {},
    onBranchChange,
    togglePane,
    problemsCount
  } = props

  return (
    <footer
      className={
        'bg-grey-6 text-grey-60 flex h-10 shrink-0 items-center justify-between border-t border-borders-5 px-4 text-[12px] font-normal not-italic leading-[15px]'
      }
    >
      <div className="flex items-center gap-2">
        <div
          role="button"
          tabIndex={0}
          onClick={() => {
            togglePane?.()
          }}
          className="flex h-full cursor-pointer gap-2.5 rounded-md px-2 py-1.5 duration-150 ease-in-out hover:bg-primary/10"
        >
          <div className="flex items-center gap-1.5">
            <Icon
              size={14}
              name="cross-circle"
              className={problemsCount.error > 0 ? 'text-destructive' : 'text-tertiary-background'}
            />
            <span className={cn('text-[12px]', problemsCount.error > 0 ? 'text-destructive' : 'text-primary')}>
              {problemsCount.error}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Icon size={14} name="warning-triangle-outline" className="text-tertiary-background" />
            <span className="text-[12px] text-primary">{problemsCount.warning}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Icon size={14} name="info-circle" className="text-tertiary-background" />
            <span className="text-[12px] text-primary">{problemsCount.info}</span>
          </div>
        </div>
        {branchesLoading || branches || currentBranch ? (
          <div className={'flex gap-2'}>
            <div className={'flex items-center'}>
              <span className="text-[12px] text-tertiary-background">Branch:</span>
              <Select.Root value={currentBranch} disabled={branchesLoading} onValueChange={onBranchChange}>
                <Select.Content>
                  {branches?.map(branch => (
                    <Select.Item key={branch} value={branch}>
                      {branch}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Root>
            </div>
          </div>
        ) : null}
      </div>
      {committedTimeAgo && authorName && (
        <Popover.Root>
          <Popover.Trigger>
            <div className="flex text-[12px] text-tertiary-background">
              Last edited
              <span className="text-primary">&nbsp;{committedTimeAgo}&nbsp;</span> by
              <span className="text-primary">&nbsp;{authorName}&nbsp;</span>
            </div>
          </Popover.Trigger>
          <Popover.Content side={'top'} className="mb-4 mr-4 w-80 p-0">
            <PopoverCommitInfo.Root>
              <PopoverCommitInfo.CommitInfo authorName={authorName} initials={authorInitials} commit={commitSha} />
              <PopoverCommitInfo.CommitMessage>{commitMessage}</PopoverCommitInfo.CommitMessage>
            </PopoverCommitInfo.Root>
          </Popover.Content>
        </Popover.Root>
      )}
    </footer>
  )
}
