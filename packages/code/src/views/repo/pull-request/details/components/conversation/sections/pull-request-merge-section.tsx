import { Dispatch, FC, MouseEvent, SetStateAction, useMemo, useState } from 'react'

import { MarkdownViewer } from '@/components/markdown-viewer'
import { PanelAccordionShowButton } from '@views/repo/pull-request/details/components/conversation/sections/panel-accordion-show-button'
import { isEmpty } from 'lodash-es'

import { Accordion, BranchTag, Button, IconV2, Layout, Link, Separator, Text } from '@harnessio/ui/components'
import { useTranslation } from '@harnessio/ui/context'
import { cn } from '@harnessio/ui/utils'

import { LineDescription, LineTitle } from './pull-request-line-title'

interface StepInfoProps {
  step: string
  description: string
  code?: string
  comment?: string | React.ReactElement
}

const StepInfo: FC<StepInfoProps> = item => {
  const code = `
\`\`\`
${item.code}
\`\`\`
    `
  return (
    <Layout.Vertical gap="xs" as="li">
      <Text color="foreground-1">
        <Text variant="body-strong" color="inherit" as="span">
          {item.step}
        </Text>{' '}
        {item.description}
      </Text>
      {item.code ? <MarkdownViewer source={code} /> : item.comment ? <Text>{item.comment}</Text> : null}
    </Layout.Vertical>
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
  repoId?: string
  spaceId?: string
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
  selectedMergeMethod,
  repoId,
  spaceId
}: PullRequestMergeSectionProps) => {
  const { t } = useTranslation()
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
      step: t('views:repo.pullRequest.mergeSection.step', 'Step {{number}}.', { number: '1' }),
      description: t(
        'views:repo.pullRequest.mergeSection.step1',
        'Clone the repository or update your local repository with the latest changes'
      ),
      code: `git pull origin ${pullReqMetadata?.target_branch}`
    },
    {
      step: t('views:repo.pullRequest.mergeSection.step', 'Step {{number}}.', { number: '2' }),
      description: t('views:repo.pullRequest.mergeSection.step2', 'Switch to the head branch of the pull request'),
      code: `git checkout ${pullReqMetadata?.source_branch}`
    },
    {
      step: t('views:repo.pullRequest.mergeSection.step', 'Step {{number}}.', { number: '3' }),
      description: t('views:repo.pullRequest.mergeSection.step3', 'Merge the base branch into the head branch'),
      code: `git merge ${pullReqMetadata?.target_branch}`
    },
    {
      step: t('views:repo.pullRequest.mergeSection.step', 'Step {{number}}.', { number: '4' }),
      description: t('views:repo.pullRequest.mergeSection.step4', 'Fix the conflicts and commit the results'),
      comment: (
        <>
          {t('views:repo.pullRequest.mergeSection.comment.1', 'See ')}
          <Link to="https://git-scm.com/book/en/v2/Git-Tools-Advanced-Merging.html#_merge_conflicts" target="_blank">
            {t('views:repo.pullRequest.mergeSection.comment.2', 'Resolving a merge conflict using the command line')}
          </Link>{' '}
          {t(
            'views:repo.pullRequest.mergeSection.comment.3',
            'for step-by-step instructions on resolving merge conflicts'
          )}
        </>
      )
    },
    {
      step: t('views:repo.pullRequest.mergeSection.step', 'Step {{number}}.', { number: '5' }),
      description: t('views:repo.pullRequest.mergeSection.step5', 'Push the changes'),
      code: `git push origin ${pullReqMetadata?.source_branch}`
    }
  ]

  const handleCommandLineClick = (e?: MouseEvent<HTMLButtonElement>) => {
    e?.preventDefault()
    e?.stopPropagation()

    setAccordionValues(prevState => [...prevState, ACCORDION_VALUE])
    setShowCommandLineInfo(prevState => !prevState)
  }

  return (
    <>
      <Accordion.Item value={ACCORDION_VALUE} className="border-0">
        <Accordion.Trigger
          className="py-cn-sm group"
          indicatorProps={{ className: cn('self-center mt-0', { hidden: mergeable || unchecked }) }}
          suffix={
            <PanelAccordionShowButton
              isShowButton={isConflicted}
              value={ACCORDION_VALUE}
              accordionValues={accordionValues}
            />
          }
          clickable={isConflicted}
        >
          <Layout.Grid gapY="4xs">
            <LineTitle
              textClassName={isConflicted ? 'text-cn-danger' : ''}
              text={
                unchecked
                  ? t('views:repo.pullRequest.mergeSection.mergeCheck', 'Merge check in progress...')
                  : !mergeable
                    ? t('views:repo.pullRequest.mergeSection.conflictsFound', 'Conflicts found in this branch')
                    : t(
                        'views:repo.pullRequest.mergeSection.noConflicts',
                        `This branch has no conflicts with {{branch}} branch`,
                        { branch: pullReqMetadata?.target_branch }
                      )
              }
              icon={
                unchecked ? (
                  <IconV2 size="lg" name="clock-solid" color="warning" />
                ) : (
                  <IconV2
                    size="lg"
                    color={mergeable ? 'success' : 'danger'}
                    name={mergeable ? 'check-circle-solid' : 'warning-triangle-solid'}
                  />
                )
              }
            />
            {unchecked && (
              <LineDescription
                text={t(
                  'views:repo.pullRequest.mergeSection.automaticMergeCheck',
                  'Checking for ability to merge automatically...'
                )}
              />
            )}
            {isConflicted && (
              <LineDescription
                text={
                  <>
                    {t('views:repo.pullRequest.mergeSection.resolveConflicts.1', 'Use the ')}
                    <Button
                      variant="link"
                      onClick={handleCommandLineClick}
                      className="relative z-10 h-auto rounded-cn-none hover:underline"
                      aria-label="Open command line"
                    >
                      {t('views:repo.pullRequest.mergeSection.resolveConflicts.2', 'command line')}
                    </Button>
                    {t('views:repo.pullRequest.mergeSection.resolveConflicts.3', ' to resolve conflicts')}
                  </>
                }
              />
            )}
          </Layout.Grid>
        </Accordion.Trigger>
        {isConflicted && (
          // TODO: Replace ml-[28px] with a proper spacing token when available
          <Accordion.Content className="ml-[28px]" containerClassName={cn({ 'pt-0 mt-0': showCommandLineInfo })}>
            <Layout.Vertical gapY="sm">
              {showCommandLineInfo && (
                <Layout.Vertical gap="sm" className="py-cn-sm border border-x-0">
                  <Text variant="heading-small">
                    {t(
                      'views:repo.pullRequest.mergeSection.resolveConflictsCommandLine',
                      'Resolve conflicts via command line'
                    )}
                  </Text>
                  <Layout.Vertical gapY="md" as="ol">
                    {stepMap.map(item => (
                      <StepInfo key={item.step} {...item} />
                    ))}
                  </Layout.Vertical>
                </Layout.Vertical>
              )}
              {!isEmpty(conflictingFiles) && (
                <Layout.Vertical gapY="sm">
                  <Text variant="body-single-line-normal">
                    {t('views:repo.pullRequest.mergeSection.conflictingFiles', 'Conflicting files ')}
                    <Text color="foreground-3" as="span">{`(${conflictingFiles?.length || 0})`}</Text>
                  </Text>

                  {conflictingFiles?.map(file => (
                    <Text
                      key={file}
                      variant="body-single-line-normal"
                      color="foreground-1"
                      className="gap-cn-2xs flex items-center"
                    >
                      <IconV2 size="md" className="text-cn-2" name="empty-page" />
                      {file}
                    </Text>
                  ))}
                </Layout.Vertical>
              )}
            </Layout.Vertical>
          </Accordion.Content>
        )}
      </Accordion.Item>

      {fastForwardState.isFastForwardNotPossible && (
        <>
          <Separator />
          <Layout.Horizontal align="center" justify="between" gapX="2xs" className="py-cn-sm">
            <Layout.Vertical gapY="4xs">
              <LineTitle
                textClassName="text-cn-danger"
                text={t(
                  'views:repo.pullRequest.mergeSection.mergeLatestChangesTitle',
                  'This branch is out-of-date with the base branch'
                )}
                icon={<IconV2 size="lg" color="danger" name="warning-triangle-solid" />}
              />
              <LineDescription
                text={
                  <Layout.Horizontal gap="2xs">
                    <Text color="foreground-3">
                      {t('views:repo.pullRequest.mergeSection.mergeLatestChanges.1', 'Merge the latest changes from')}
                    </Text>
                    <BranchTag branchName={pullReqMetadata?.target_branch || ''} spaceId={spaceId} repoId={repoId} />
                    <Text color="foreground-3">
                      {t('views:repo.pullRequest.mergeSection.mergeLatestChanges.2', 'into')}
                    </Text>
                    <BranchTag branchName={pullReqMetadata?.source_branch || ''} spaceId={spaceId} repoId={repoId} />
                  </Layout.Horizontal>
                }
              />
            </Layout.Vertical>

            {handleRebaseBranch && (
              <Button theme="default" variant="outline" onClick={handleRebaseBranch} loading={isRebasing}>
                {t('views:repo.pullRequest.mergeSection.updateWithRebase', 'Update with rebase')}
              </Button>
            )}
          </Layout.Horizontal>
        </>
      )}
    </>
  )
}

PullRequestMergeSection.displayName = 'PullRequestMergeSection'

export default PullRequestMergeSection
