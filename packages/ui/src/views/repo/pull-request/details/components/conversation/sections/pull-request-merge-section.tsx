import { Dispatch, FC, MouseEvent, SetStateAction, useMemo, useState } from 'react'

import { Accordion, Button, CopyButton, IconV2, Layout, StackedList, Tag, Text } from '@/components'
import { cn } from '@utils/cn'
import { PanelAccordionShowButton } from '@views/repo/pull-request/details/components/conversation/sections/panel-accordion-show-button'
import { isEmpty } from 'lodash-es'

import { LineDescription, LineTitle } from './pull-request-line-title'

interface StepInfoProps {
  step: string
  description: string
  code?: string
  comment?: string
}

const StepInfo: FC<StepInfoProps> = item => {
  return (
    <li>
      <Layout.Horizontal gap="3xs">
        <Text as="h3" variant="body-strong" color="foreground-1" className="flex-none">
          {item.step}
        </Text>
        <Layout.Vertical className="w-[90%] max-w-full">
          <Text>{item.description}</Text>
          <div
            className={cn('text-2 text-cn-foreground-2', {
              'border border-cn-borders-2 rounded-md px-2 py-1 !my-2': item.code,
              '!my-1': item.comment
            })}
          >
            <Layout.Horizontal align="center" justify="between">
              <Text>{item.code ? item.code : item.comment}</Text>
              {!!item.code && <CopyButton name={item.code} />}
            </Layout.Horizontal>
          </div>
        </Layout.Vertical>
      </Layout.Horizontal>
    </li>
  )
}

StepInfo.displayName = 'StepInfo'

const ACCORDION_VALUE = 'item-4'

interface PullRequestMergeSectionProps {
  unchecked: boolean
  mergeable: boolean
  pullReqMetadata:
    | {
        target_branch?: string | undefined
        source_branch?: string | undefined
        merge_target_sha?: string | null
        merge_base_sha?: string
        merged?: number | null
      }
    | undefined
  conflictingFiles?: string[]
  accordionValues: string[]
  setAccordionValues: Dispatch<SetStateAction<string[]>>
  handleRebaseBranch?: () => void
  selectedMergeMethod?: string
}
const PullRequestMergeSection = ({
  unchecked,
  mergeable,
  pullReqMetadata,
  conflictingFiles,
  accordionValues,
  setAccordionValues,
  handleRebaseBranch,
  selectedMergeMethod
}: PullRequestMergeSectionProps) => {
  const [showCommandLineInfo, setShowCommandLineInfo] = useState(false)

  const isConflicted = !mergeable && !unchecked

  // Memoized Fast-Forward logic calculations
  const fastForwardState = useMemo(() => {
    const isRebasable =
      pullReqMetadata?.merge_target_sha !== pullReqMetadata?.merge_base_sha && !pullReqMetadata?.merged
    const isFastForwardSelected = selectedMergeMethod === 'fast-forward'
    const isFastForwardNotPossible = isRebasable && isFastForwardSelected

    return {
      isRebasable,
      isFastForwardSelected,
      isFastForwardNotPossible
    }
  }, [pullReqMetadata?.merge_target_sha, pullReqMetadata?.merge_base_sha, pullReqMetadata?.merged, selectedMergeMethod])

  const stepMap = [
    {
      step: 'Step 1',
      description: 'Clone the repository or update your local repository with the latest changes',
      code: `git pull origin ${pullReqMetadata?.target_branch}`
    },
    {
      step: 'Step 2',
      description: 'Switch to the head branch of the pull request',
      code: `git checkout ${pullReqMetadata?.source_branch}`
    },
    {
      step: 'Step 3',
      description: 'Merge the base branch into the head branch',
      code: `git merge ${pullReqMetadata?.target_branch}`
    },
    {
      step: 'Step 4',
      description: ' Fix the conflicts and commit the result',
      comment:
        'See Resolving a merge conflict using the command line for step-by-step instruction on resolving merge conflicts'
    },
    {
      step: 'Step 5',
      description: 'Push the changes',
      code: `git push origin ${pullReqMetadata?.source_branch}`
    }
  ]

  const handleCommandLineClick = (e?: MouseEvent<HTMLButtonElement>) => {
    e?.stopPropagation()

    setAccordionValues(prevState => [...prevState, ACCORDION_VALUE])
    setShowCommandLineInfo(prevState => !prevState)
  }

  // Helper function to render branch tags
  const renderBranchTags = () => (
    <span className="inline-flex items-center gap-1">
      <span>Merge the latest changes from</span>
      <Tag
        variant="secondary"
        theme="blue"
        icon="git-branch"
        value={pullReqMetadata?.target_branch || ''}
        showIcon
        showCopyButton
      />
      <span>into</span>
      <Tag
        variant="secondary"
        theme="blue"
        icon="git-branch"
        value={pullReqMetadata?.source_branch || ''}
        showIcon
        showCopyButton
      />
    </span>
  )

  return (
    <>
      <Accordion.Item value={ACCORDION_VALUE} className="border-0">
        <Accordion.Trigger
          className={cn('py-3', { '[&>.cn-accordion-trigger-indicator]:hidden': mergeable || unchecked })}
        >
          <Layout.Flex>
            <StackedList.Field
              className="flex gap-y-1"
              title={
                <LineTitle
                  textClassName={isConflicted ? 'text-cn-foreground-danger' : ''}
                  text={
                    unchecked
                      ? 'Merge check in progress...'
                      : !mergeable
                        ? 'Conflicts found in this branch'
                        : `This branch has no conflicts with ${pullReqMetadata?.target_branch} branch`
                  }
                  icon={
                    unchecked ? (
                      <IconV2 size="md" name="clock-solid" className="text-cn-foreground-warning" />
                    ) : (
                      <IconV2
                        size="md"
                        className={mergeable ? 'text-cn-icon-success' : 'text-cn-foreground-danger'}
                        name={mergeable ? 'check-circle-solid' : 'warning-triangle-solid'}
                      />
                    )
                  }
                />
              }
              description={
                <>
                  {unchecked && <LineDescription text={'Checking for ability to merge automatically...'} />}
                  {isConflicted && (
                    <LineDescription
                      text={
                        <>
                          Use the&nbsp;
                          <Button variant="link" onClick={handleCommandLineClick} asChild className="h-4">
                            <span
                              role="button"
                              tabIndex={0}
                              aria-label="Open command line"
                              onKeyDown={e => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                  e.stopPropagation()
                                  handleCommandLineClick()
                                }
                              }}
                            >
                              command line
                            </span>
                          </Button>
                          &nbsp;to resolve conflicts
                        </>
                      }
                    />
                  )}
                </>
              }
            />
            <PanelAccordionShowButton
              isShowButton={isConflicted}
              value={ACCORDION_VALUE}
              accordionValues={accordionValues}
            />
          </Layout.Flex>
        </Accordion.Trigger>
        {isConflicted && (
          <Accordion.Content className="ml-7">
            <>
              {showCommandLineInfo && (
                <div className="mb-3.5 rounded-md border border-cn-borders-2 p-1 px-4 py-2">
                  <Text variant="heading-small" color="foreground-1">
                    Resolve conflicts via command line
                  </Text>
                  <ol className="flex flex-col gap-y-3">
                    {stepMap.map(item => (
                      <StepInfo key={item.step} {...item} />
                    ))}
                  </ol>
                </div>
              )}
              <Text as="span">
                Conflicting files <Text as="span">{conflictingFiles?.length || 0}</Text>
              </Text>

              {!isEmpty(conflictingFiles) && (
                <div className="mt-1">
                  {conflictingFiles?.map(file => (
                    <div className="flex items-center gap-x-2 py-1.5" key={file}>
                      <IconV2 size="md" className="text-icons-1" name="page" />
                      <Text as="span" color="foreground-1">
                        {file}
                      </Text>
                    </div>
                  ))}
                </div>
              )}
            </>
          </Accordion.Content>
        )}
      </Accordion.Item>

      {/* Fast-Forward merge error section - Using proper StackedList.Item */}
      {fastForwardState.isFastForwardNotPossible && (
        <StackedList.Item disableHover className="border-t border-cn-borders-3 py-3 -ml-4">
          <StackedList.Field
            className="flex gap-y-1"
            title={
              <LineTitle
                textClassName="text-cn-foreground-danger"
                text="This branch is out-of-date with the base branch"
                icon={<IconV2 size="md" className="text-cn-foreground-danger" name="warning-triangle-solid" />}
              />
            }
            description={<LineDescription text={renderBranchTags()} />}
          />
          {handleRebaseBranch && (
            <Button theme="default" variant="primary" onClick={handleRebaseBranch} size="md">
              Update with rebase
            </Button>
          )}
        </StackedList.Item>
      )}
    </>
  )
}

PullRequestMergeSection.displayName = 'PullRequestMergeSection'

export default PullRequestMergeSection
