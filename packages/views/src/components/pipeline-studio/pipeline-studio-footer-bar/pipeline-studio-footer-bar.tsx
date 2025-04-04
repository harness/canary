import { Icon, Popover, Select } from '@harnessio/ui/components'
import { cn } from '@harnessio/ui/utils'

import { PopoverCommitInfo } from '../popover-commit-info'

interface PipelineStudioFooterBarProps {
  problems: {
    error: number
    warning: number
    info: number
  }
  lastCommitInfo: {
    committedTimeAgo: string
    authorName: string
    authorInitials?: string
    commitSha?: string
    commitMessage?: string
  }
  currentBranch?: string
  branches?: string[]
  branchesLoading: boolean
  onBranchChange: (branch: string) => void
  togglePane?: () => void
}

const PipelineStudioFooterBar: React.FC<PipelineStudioFooterBarProps> = (props: PipelineStudioFooterBarProps) => {
  const { currentBranch, branchesLoading, branches, lastCommitInfo, onBranchChange } = props
  const { committedTimeAgo, authorName, authorInitials, commitSha, commitMessage } = lastCommitInfo

  return (
    <footer
      className={
        'bg-grey-6 text-grey-60 flex h-10 shrink-0 items-center justify-between border-t border-[#1d1d20] px-4 text-[12px] font-normal not-italic leading-[15px]'
      }
    >
      <div className="flex items-center gap-2">
        <div
          role="button"
          tabIndex={0}
          onClick={() => {
            props.togglePane?.()
          }}
          className="flex h-full cursor-pointer gap-2.5 rounded-md px-2 py-1.5 duration-150 ease-in-out hover:bg-primary/10"
        >
          <div className="flex items-center gap-1.5">
            <Icon
              size={14}
              name="cross-circle"
              className={props.problems.error > 0 ? 'text-destructive' : 'text-tertiary-background'}
            />
            <span className={cn('text-[12px]', props.problems.error > 0 ? 'text-destructive' : 'text-primary')}>
              {props.problems.error}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Icon size={14} name="warning-triangle-outline" className="text-tertiary-background" />
            <span className="text-[12px] text-primary">{props.problems.warning}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Icon size={14} name="info-circle" className="text-tertiary-background" />
            <span className="text-[12px] text-primary">{props.problems.info}</span>
          </div>
        </div>
        <div className={'flex gap-2'}>
          {/* <div className="flex gap-1 items-center">
            <span className="text-tertiary-background text-[12px]">Repository:</span>
            <Select defaultValue="harness-next">
              <SelectTrigger className="w-fit border-none px-1 text-primary text-[12px] focus:ring-[0px]">
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="harness-next">harness-next</SelectItem>
                <SelectItem value="canary">canary</SelectItem>
                <SelectItem value="devops">devops</SelectItem>
                <SelectItem value="unscripted">unscripted</SelectItem>
              </SelectContent>
            </Select>
          </div> */}
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

export { PipelineStudioFooterBar }
