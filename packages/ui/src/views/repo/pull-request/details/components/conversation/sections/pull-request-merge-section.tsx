import { Dispatch, FC, MouseEvent, SetStateAction, useMemo, useState } from 'react'

import { Accordion, Button, Card, CopyButton, CopyTag, IconV2, Layout, Link, StackedList, Text } from '@/components'
import { cn } from '@utils/cn'
import { PanelAccordionShowButton } from '@views/repo/pull-request/details/components/conversation/sections/panel-accordion-show-button'
import { isEmpty } from 'lodash-es'

import { LineDescription, LineTitle } from './pull-request-line-title'

interface StepInfoProps {
  step: string
  description: string
  code?: string
  comment?: string | React.ReactElement
}

const StepInfo: FC<StepInfoProps> = item => {
  return (
    <li>
      <Layout.Horizontal gap="2xs">
        <Text as="h3" variant="body-strong" className="flex-none">
          {item.step}
        </Text>
        <Layout.Vertical className="w-[90%] max-w-full" gap="xs">
          <Text variant="body-normal">{item.description}</Text>
          {item.code ? (
            <Layout.Horizontal
              align="center"
              justify="between"
              className="border border-cn-borders-2 rounded-md px-1.5 py-1.5 mt-1 mb-3"
            >
              <Text variant="body-normal" className="font-mono">
                {item.code}
              </Text>
              <CopyButton name={item.code} size="xs" />
            </Layout.Horizontal>
          ) : item.comment ? (
            <Text variant="body-normal" className="my-1">
              {item.comment}
            </Text>
          ) : null}
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
  isRebasing?: boolean
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
  isRebasing,
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
      description: 'Fix the conflicts and commit the results',
      comment: (
        <>
          See{' '}
          <Link to="https://git-scm.com/book/en/v2/Git-Tools-Advanced-Merging.html#_merge_conflicts" target="_blank">
            Resolving a merge conflict using the command line
          </Link>{' '}
          for step-by-step instructions on resolving merge conflicts
        </>
      )
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
      <CopyTag variant="secondary" theme="gray" icon="git-branch" value={pullReqMetadata?.target_branch || ''} />
      <span>into</span>
      <CopyTag variant="secondary" theme="gray" icon="git-branch" value={pullReqMetadata?.source_branch || ''} />
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
                      <IconV2 size="lg" name="clock-solid" className="text-cn-foreground-warning" />
                    ) : (
                      <IconV2
                        size="lg"
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
                <Card.Root className="mb-3.5 bg-transparent border-cn-borders-3" size="sm">
                  <Card.Content className="px-4 py-2">
                    <Layout.Vertical gap="sm">
                      <Text variant="heading-small">Resolve conflicts via command line</Text>
                      <ol className="flex flex-col gap-y-0.5">
                        {stepMap.map(item => (
                          <StepInfo key={item.step} {...item} />
                        ))}
                      </ol>
                    </Layout.Vertical>
                  </Card.Content>
                </Card.Root>
              )}
              <Text variant="body-normal">Conflicting files {conflictingFiles?.length || 0}</Text>

              {!isEmpty(conflictingFiles) && (
                <Layout.Vertical gap="xs" className="mt-1">
                  {conflictingFiles?.map(file => (
                    <Layout.Horizontal key={file} align="center" gap="xs" className="py-1.5">
                      <IconV2 size="lg" className="text-icons-1" name="empty-page" />
                      <Text variant="body-normal">{file}</Text>
                    </Layout.Horizontal>
                  ))}
                </Layout.Vertical>
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
                icon={<IconV2 size="lg" className="text-cn-foreground-danger" name="warning-triangle-solid" />}
              />
            }
            description={<LineDescription text={renderBranchTags()} />}
          />
          {handleRebaseBranch && (
            <Button theme="default" variant="primary" onClick={handleRebaseBranch} loading={isRebasing} size="md">
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
