import { useMemo } from 'react'

import { IconV2, Popover, Select, Text } from '@/components'

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
        'border-cn-3 px-cn-md font-caption-single-line-normal flex h-10 shrink-0 items-center justify-between border-t'
      }
    >
      <div className="gap-cn-xs flex items-center">
        <div
          role="button"
          tabIndex={0}
          onClick={() => {
            togglePane?.()
          }}
          className="gap-cn-xs rounded-cn-3 px-cn-xs py-cn-2xs hover:bg-cn-brand-hover/10 flex h-full cursor-pointer duration-150 ease-in-out"
        >
          <div className="gap-cn-2xs flex items-center">
            <IconV2
              size="xs"
              name="xmark-circle"
              className={problemsCount.error > 0 ? 'text-cn-danger' : 'text-cn-3'}
            />
            <Text variant="caption-single-line-normal" color={problemsCount.error > 0 ? 'danger' : 'foreground-1'}>
              {problemsCount.error}
            </Text>
          </div>
          <div className="gap-cn-2xs flex items-center">
            <IconV2 size="xs" name="warning-triangle" className="text-cn-3" />
            <Text variant="caption-single-line-normal" color="foreground-1">
              {problemsCount.warning}
            </Text>
          </div>
          <div className="gap-cn-2xs flex items-center">
            <IconV2 size="xs" name="info-circle" className="text-cn-3" />
            <Text variant="caption-single-line-normal" color="foreground-1">
              {problemsCount.info}
            </Text>
          </div>
        </div>
        {(branchesLoading || branches || currentBranch) && (
          <div className={'gap-cn-xs flex'}>
            <div className={'flex items-center'}>
              <Text variant="caption-single-line-normal" color="foreground-3">
                Branch:
              </Text>

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
            <Text as="p" variant="caption-single-line-normal" color="foreground-3" className="flex">
              Last edited
              <Text variant="caption-single-line-normal" color="foreground-1">
                &nbsp;{committedTimeAgo}&nbsp;
              </Text>{' '}
              by
              <Text variant="caption-single-line-normal" color="foreground-1">
                &nbsp;{authorName}&nbsp;
              </Text>
            </Text>
          </Popover.Trigger>
          <Popover.Content side="top" className="mb-cn-md mr-cn-md w-80 p-0">
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
