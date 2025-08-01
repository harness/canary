import { FC, ReactElement, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'

import { Avatar, Button, IconV2, Layout, Link, LinkProps, NoData, SkeletonList, Spacer, Tabs, Text } from '@/components'
import { useRouterContext, useTranslation } from '@/context'
import { TypesDiffStats } from '@/types'
import {
  CommitSelectorListItem,
  CommitsList,
  HandleAiPullRequestSummaryType,
  HandleUploadType,
  ILabelType,
  LabelValuesType,
  PrincipalPropsType,
  PullRequestSideBar,
  SandboxLayout,
  TypesCommit
} from '@/views'
import { zodResolver } from '@hookform/resolvers/zod'
import { ICommitSelectorStore } from '@views/repo/components/commit-selector/types'
import PullRequestCompareButton from '@views/repo/pull-request/compare/components/pull-request-compare-button'
import PullRequestCompareForm from '@views/repo/pull-request/compare/components/pull-request-compare-form'
import { noop } from 'lodash-es'
import { z } from 'zod'

import {
  EnumPullReqReviewDecision,
  HandleAddLabelType,
  LabelAssignmentType,
  PRReviewer,
  PullReqReviewDecision
} from '../pull-request.types'
import PullRequestCompareDiffList from './components/pull-request-compare-diff-list'
import { HeaderProps } from './pull-request-compare.types'

export const pullRequestFormSchema = z.object({
  title: z.string().min(1, { message: 'Please provide a pull request title' }),
  description: z.string().optional()
})

export type CompareFormFields = z.infer<typeof pullRequestFormSchema>

export const DiffModeOptions = [
  { name: 'Split', value: 'Split' },
  { name: 'Unified', value: 'Unified' }
]
interface RoutingProps {
  toCommitDetails?: ({ sha }: { sha: string }) => string
  toCode?: ({ sha }: { sha: string }) => string
  toPullRequestConversation?: ({ pullRequestId }: { pullRequestId: number }) => string
}
export interface PullRequestComparePageProps extends Partial<RoutingProps> {
  onFormSubmit: (data: CompareFormFields) => void
  onFormDraftSubmit: (data: CompareFormFields) => void
  onFormCancel: () => void
  apiError: string | null
  isLoading: boolean
  isSuccess: boolean
  mergeability?: boolean
  onSelectCommit: (commit: CommitSelectorListItem) => void
  handleAiPullRequestSummary?: HandleAiPullRequestSummaryType

  diffData: HeaderProps[]
  diffStats: TypesDiffStats
  isBranchSelected: boolean
  setIsBranchSelected: (val: boolean) => void
  prBranchCombinationExists: { number: number; title: string; description: string } | null
  repoId?: string
  spaceId?: string
  useRepoCommitsStore: () => ICommitSelectorStore
  searchCommitQuery: string | null
  setSearchCommitQuery: (query: string | null) => void
  currentUser?: string

  reviewers?: PRReviewer[]
  handleAddReviewer: (id?: number) => void
  handleDeleteReviewer: (id?: number) => void
  handleUpload?: HandleUploadType
  desc?: string
  setDesc: (desc: string) => void
  prTemplate?: string
  isFetchingCommits?: boolean
  jumpToDiff: string
  setJumpToDiff: (fileName: string) => void
  labelsList?: ILabelType[]
  labelsValues?: LabelValuesType
  PRLabels?: LabelAssignmentType[]
  searchLabelQuery?: string
  setSearchLabelQuery: (query: string) => void
  addLabel?: (data: HandleAddLabelType) => void
  removeLabel?: (id: number) => void
  editLabelsProps: LinkProps
  branchSelectorRenderer: ReactElement
  principalProps: PrincipalPropsType
  onGetFullDiff: (path?: string) => Promise<string | void>
  toRepoFileDetails?: ({ path }: { path: string }) => string
  sourceBranch?: string
  isLabelsLoading?: boolean
}

export const PullRequestComparePage: FC<PullRequestComparePageProps> = ({
  onFormSubmit,
  apiError = null,
  isLoading,
  isSuccess,
  onFormDraftSubmit,
  mergeability = false,
  handleAiPullRequestSummary,

  diffData,
  diffStats,
  isBranchSelected,
  prBranchCombinationExists,
  useRepoCommitsStore,
  currentUser,

  principalProps,
  reviewers,
  handleAddReviewer,
  handleDeleteReviewer,
  toCommitDetails,
  toCode,
  handleUpload,
  desc,
  setDesc,
  prTemplate,
  isFetchingCommits,
  jumpToDiff,
  setJumpToDiff,
  onGetFullDiff,
  toRepoFileDetails,
  sourceBranch,

  labelsList = [],
  labelsValues = {},
  PRLabels = [],
  searchLabelQuery,
  setSearchLabelQuery,
  addLabel,
  removeLabel,
  editLabelsProps,
  branchSelectorRenderer,
  toPullRequestConversation,
  isLabelsLoading
}) => {
  const { commits: commitData } = useRepoCommitsStore()

  const formRef = useRef<HTMLFormElement>(null) // Create a ref for the form
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false)
  const { navigate } = useRouterContext()
  const { t } = useTranslation()

  const formMethods = useForm<CompareFormFields>({
    resolver: zodResolver(pullRequestFormSchema),
    mode: 'onChange',
    defaultValues: {
      title: '',
      description: ''
    }
  })

  const {
    reset,
    getValues,
    setValue,
    formState: { isValid },
    watch
  } = formMethods

  const descriptionValue = watch('description')

  useEffect(() => {
    setValue('description', desc)
  }, [desc])

  useEffect(() => {
    setDesc(descriptionValue ?? '')
  }, [descriptionValue, setDesc])

  useEffect(() => {
    if (prTemplate) {
      setValue('description', prTemplate)
    }
  }, [prTemplate, setValue])

  useEffect(() => {
    if (commitData && commitData.length > 0) {
      reset({
        title: commitData[commitData.length - 1]?.title,
        description: prTemplate ?? ''
      })
    }
  }, [commitData, reset, prTemplate])

  useEffect(() => {
    if (isSuccess) {
      reset()
      setIsSubmitted(true)
    }
  }, [isSuccess, reset])

  const mockProcessReviewDecision = (
    review_decision: EnumPullReqReviewDecision,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    reviewedSHA?: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    sourceSHA?: string
  ): EnumPullReqReviewDecision | PullReqReviewDecision.outdated => {
    // Return a default value
    return review_decision
  }
  return (
    <SandboxLayout.Main fullWidth>
      <SandboxLayout.Content>
        <span className="text-6 font-medium leading-snug tracking-tight text-cn-foreground-1">
          {t('views:pullRequests.compareChanges', 'Comparing changes')}
        </span>
        <Layout.Vertical className="mt-2.5">
          <Text className="max-w-xl">
            {t(
              'views:pullRequests.compareChangesDescription',
              'Choose two branches to see what’s changed or to start a new pull request.'
            )}
          </Text>
          <Layout.Horizontal align="center" gap="xs">
            {branchSelectorRenderer}

            {isBranchSelected &&
              !isLoading && ( // Only render this block if isBranchSelected is true
                <Layout.Horizontal gap="xs" align="center">
                  {mergeability ? (
                    <>
                      <IconV2 className="text-icons-success" name="check" size="2xs" />
                      <Text variant="body-single-line-normal" color="success">
                        {t('views:pullRequests.compareChangesAbleToMerge', 'Able to merge.')}{' '}
                        <Text variant="body-single-line-normal" as="span" color="foreground-2">
                          {t(
                            'views:pullRequests.compareChangesAbleToMergeDescription',
                            'These branches can be automatically merged.'
                          )}
                        </Text>
                      </Text>
                    </>
                  ) : (
                    <>
                      {apiError === "head branch doesn't contain any new commits." ? (
                        <>
                          <IconV2 name="xmark" size="2xs" className="text-icons-1" />
                          <Text variant="body-single-line-normal">
                            {t(
                              'views:pullRequests.compareChangesApiError',
                              'Head branch doesn’t contain any new commits.'
                            )}
                          </Text>
                        </>
                      ) : (
                        <>
                          <IconV2 className="text-icons-danger" name="xmark" size="2xs" />
                          <Text variant="body-single-line-normal" color="danger">
                            {t('views:pullRequests.compareChangesCantMerge', 'Can’t be merged.')}{' '}
                            <span className="text-cn-foreground-2">
                              {t(
                                'views:pullRequests.compareChangesCantMergeDescription',
                                'You can still create the pull request.'
                              )}
                            </span>
                          </Text>
                        </>
                      )}
                    </>
                  )}
                </Layout.Horizontal>
              )}
          </Layout.Horizontal>
        </Layout.Vertical>
        {!prBranchCombinationExists && (
          <Layout.Horizontal
            align="center"
            justify="between"
            className="mt-4 rounded-md border border-cn-borders-2 bg-cn-background-2 p-4"
          >
            <p className="text-2 leading-none">
              {isBranchSelected ? (
                <>
                  {t(
                    'views:pullRequests.compareChangesDiscussChanges',
                    'Discuss and review the changes in this comparison with others.'
                  )}{' '}
                  <Link
                    to="https://www.harness.io/harness-devops-academy/pull-request"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t('views:pullRequests.compareChangesDiscussChangesLink', 'Learn about pull requests.')}
                  </Link>
                </>
              ) : (
                t(
                  'views:pullRequests.compareChangesChooseDifferent',
                  'Choose different branches above to discuss and review changes.'
                )
              )}
            </p>
            <PullRequestCompareButton
              isSubmitted={isSubmitted}
              isValid={isValid}
              isLoading={isLoading}
              formRef={formRef}
              getFormValues={getValues}
              onFormDraftSubmit={onFormDraftSubmit}
              onFormSubmit={onFormSubmit}
            />
          </Layout.Horizontal>
        )}
        {prBranchCombinationExists && (
          <Layout.Horizontal
            align="center"
            justify="between"
            className="mt-4 rounded-md border border-cn-borders-2 bg-cn-background-2 p-4"
          >
            <div className="flex items-center gap-x-1.5">
              <div>
                <Layout.Horizontal align="center">
                  <IconV2 name="git-compare" size="xs" className="text-icons-success" />
                  <div className="flex gap-x-1">
                    {/* TODO: add the name of the PR instead this placeholder */}
                    <Text color="foreground-1">{prBranchCombinationExists.title}</Text>
                    <span className="text-cn-foreground-2">{`#${prBranchCombinationExists.number}`}</span>
                  </div>
                </Layout.Horizontal>

                <Text>{prBranchCombinationExists.description}</Text>
              </div>
            </div>
            <Button
              onClick={() =>
                navigate(toPullRequestConversation?.({ pullRequestId: prBranchCombinationExists.number }) ?? '')
              }
            >
              {t('views:pullRequests.compareChangesViewPRLink', 'View pull request')}
            </Button>
          </Layout.Horizontal>
        )}
        {isBranchSelected ? (
          <Layout.Vertical className="mt-10">
            <Tabs.Root defaultValue={prBranchCombinationExists ? 'commits' : 'overview'}>
              <Tabs.List variant="overlined" className="-mx-8 px-8">
                {!prBranchCombinationExists && (
                  <Tabs.Trigger value="overview" icon="info-circle">
                    {t('views:pullRequests.compareChangesTabOverview', 'Overview')}
                  </Tabs.Trigger>
                )}
                <Tabs.Trigger value="commits" icon="git-commit" counter={diffStats?.commits}>
                  {t('views:pullRequests.compareChangesTabCommits', 'Commits')}
                </Tabs.Trigger>
                <Tabs.Trigger value="changes" icon="page" counter={diffStats?.files_changed}>
                  {t('views:pullRequests.compareChangesTabChanges', 'Changes')}
                </Tabs.Trigger>
              </Tabs.List>
              {!prBranchCombinationExists && (
                <Tabs.Content className="pt-7" value="overview">
                  <div className="grid grid-cols-[1fr_288px] gap-x-8">
                    <div className="flex gap-x-3">
                      {currentUser && <Avatar name={currentUser} rounded />}
                      <div className="w-full">
                        <Spacer size={1} />
                        <PullRequestCompareForm
                          principalProps={principalProps}
                          description={desc}
                          setDescription={setDesc}
                          handleUpload={handleUpload}
                          ref={formRef}
                          apiError={apiError}
                          isLoading={isLoading}
                          onFormDraftSubmit={onFormDraftSubmit}
                          onFormSubmit={onFormSubmit}
                          formMethods={formMethods}
                          handleAiPullRequestSummary={handleAiPullRequestSummary}
                        />
                      </div>
                    </div>
                    <PullRequestSideBar
                      isReviewersLoading={principalProps?.isPrincipalsLoading}
                      isLabelsLoading={isLabelsLoading}
                      addReviewers={handleAddReviewer}
                      currentUserId={currentUser}
                      pullRequestMetadata={{ source_sha: '' }}
                      processReviewDecision={mockProcessReviewDecision}
                      refetchReviewers={noop}
                      handleDelete={handleDeleteReviewer}
                      reviewers={reviewers ?? []}
                      searchQuery={principalProps?.searchPrincipalsQuery || ''}
                      setSearchQuery={principalProps?.setSearchPrincipalsQuery || noop}
                      usersList={principalProps?.principals}
                      labelsList={labelsList}
                      labelsValues={labelsValues}
                      PRLabels={PRLabels}
                      addLabel={addLabel}
                      removeLabel={removeLabel}
                      editLabelsProps={editLabelsProps}
                      searchLabelQuery={searchLabelQuery}
                      setSearchLabelQuery={setSearchLabelQuery}
                      isCreatingPr
                    />
                  </div>
                </Tabs.Content>
              )}
              <Tabs.Content className="pt-7" value="commits">
                {/* TODO: add pagination to this */}
                {isFetchingCommits ? (
                  <SkeletonList />
                ) : (commitData ?? []).length > 0 ? (
                  <CommitsList
                    toCode={toCode}
                    toCommitDetails={toCommitDetails}
                    data={commitData?.map((item: TypesCommit) => ({
                      sha: item.sha,
                      parent_shas: item.parent_shas,
                      title: item.title,
                      message: item.message,
                      author: item.author,
                      committer: item.committer
                    }))}
                  />
                ) : (
                  <NoData
                    imageName="no-data-commits"
                    title={t('views:noData.noCommitsYet', 'No commits yet')}
                    description={[
                      t(
                        'views:noData.noCommitsYetDescription',
                        "Your commits will appear here once they're made. Start committing to see your changes reflected."
                      )
                    ]}
                  />
                )}
              </Tabs.Content>
              <Tabs.Content className="pt-7" value="changes">
                {/* Content for Changes */}
                {(diffData ?? []).length > 0 ? (
                  <PullRequestCompareDiffList
                    principalProps={principalProps}
                    diffData={diffData}
                    currentUser={currentUser}
                    diffStats={diffStats}
                    jumpToDiff={jumpToDiff}
                    setJumpToDiff={setJumpToDiff}
                    onGetFullDiff={onGetFullDiff}
                    toRepoFileDetails={toRepoFileDetails}
                    sourceBranch={sourceBranch}
                  />
                ) : (
                  <NoData
                    imageName="no-data-folder"
                    title="No changes to display"
                    description={['There are no changes to display for the selected branches.']}
                  />
                )}
              </Tabs.Content>
            </Tabs.Root>
          </Layout.Vertical>
        ) : (
          <>
            <Spacer size={10} />
            <NoData
              imageName="no-data-pr"
              title={t('views:noData.compareChanges')}
              description={[t('views:noData.compareChangesDescription')]}
            />
          </>
        )}
      </SandboxLayout.Content>
    </SandboxLayout.Main>
  )
}
