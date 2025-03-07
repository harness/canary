import { FC, ReactElement, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { LinkProps } from 'react-router-dom'

import { Avatar, Button, Icon, NoData, SkeletonList, Spacer, StyledLink, Tabs } from '@/components'
import { useRouterContext } from '@/context'
import { PrincipalType, TypesDiffStats } from '@/types'
import {
  CommitSelectorListItem,
  CommitsList,
  HandleUploadType,
  ILabelType,
  LabelValuesType,
  PullRequestSideBar,
  SandboxLayout,
  TranslationStore,
  TypesCommit
} from '@/views'
import { zodResolver } from '@hookform/resolvers/zod'
import { getInitials } from '@utils/stringUtils'
import { Layout } from '@views/layouts/layout'
import { ICommitSelectorStore } from '@views/repo/components/commit-selector/types'
import PullRequestCompareButton from '@views/repo/pull-request/compare/components/pull-request-compare-button'
import PullRequestCompareForm from '@views/repo/pull-request/compare/components/pull-request-compare-form'
import TabTriggerItem from '@views/repo/pull-request/compare/components/pull-request-compare-tab-trigger-item'
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

export const makePullRequestFormSchema = (t: TranslationStore['t']) =>
  z.object({
    title: z
      .string()
      .trim()
      .nonempty(t('views:pullRequests.compare.validation.titleNoEmpty', 'Pull request title can’t be blank'))
      .max(
        256,
        t('views:pullRequests.compare.validation.titleMax', 'Pull request title must be no longer than 256 characters')
      ),
    description: z.string().optional()
  })

export type CompareFormFields = z.infer<ReturnType<typeof makePullRequestFormSchema>>

export const DiffModeOptions = [
  { name: 'Split', value: 'Split' },
  { name: 'Unified', value: 'Unified' }
]
interface RoutingProps {
  toCommitDetails?: ({ sha }: { sha: string }) => string
  toCode?: ({ sha }: { sha: string }) => string
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

  diffData: HeaderProps[]
  diffStats: TypesDiffStats
  isBranchSelected: boolean
  setIsBranchSelected: (val: boolean) => void
  prBranchCombinationExists: { number: number; title: string; description: string } | null
  useTranslationStore: () => TranslationStore
  repoId?: string
  spaceId?: string
  useRepoCommitsStore: () => ICommitSelectorStore
  searchCommitQuery: string | null
  setSearchCommitQuery: (query: string | null) => void
  currentUser?: string

  searchReviewersQuery: string
  setSearchReviewersQuery: (query: string) => void
  usersList?: PrincipalType[]
  reviewers?: PRReviewer[]
  handleAddReviewer: (id?: number) => void
  handleDeleteReviewer: (id?: number) => void
  handleUpload?: HandleUploadType
  desc?: string
  setDesc: (desc: string) => void
  isFetchingCommits?: boolean
  jumpToDiff: string
  setJumpToDiff: (fileName: string) => void
  labelsList?: ILabelType[]
  labelsValues?: LabelValuesType
  PRLabels?: LabelAssignmentType[]
  searchLabelQuery?: string
  setSearchLabelQuery?: (query: string) => void
  addLabel?: (data: HandleAddLabelType) => void
  removeLabel?: (id: number) => void
  editLabelsProps: LinkProps
  branchSelectorRenderer: ReactElement
}

export const PullRequestComparePage: FC<PullRequestComparePageProps> = ({
  onFormSubmit,
  apiError = null,
  isLoading,
  isSuccess,
  onFormDraftSubmit,
  mergeability = false,

  diffData,
  diffStats,
  isBranchSelected,
  prBranchCombinationExists,
  useTranslationStore,
  useRepoCommitsStore,
  currentUser,

  searchReviewersQuery,
  setSearchReviewersQuery,
  usersList,
  reviewers,
  handleAddReviewer,
  handleDeleteReviewer,
  toCommitDetails,
  toCode,
  handleUpload,
  desc,
  setDesc,
  isFetchingCommits,
  jumpToDiff,
  setJumpToDiff,
  labelsList = [],
  labelsValues = {},
  PRLabels = [],
  searchLabelQuery,
  setSearchLabelQuery,
  addLabel,
  removeLabel,
  editLabelsProps,
  branchSelectorRenderer
}) => {
  const { commits: commitData } = useRepoCommitsStore()

  const formRef = useRef<HTMLFormElement>(null) // Create a ref for the form
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false)
  const { navigate } = useRouterContext()
  const { t } = useTranslationStore()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid }
  } = useForm<CompareFormFields>({
    resolver: zodResolver(makePullRequestFormSchema(t)),
    mode: 'onChange',
    defaultValues: {
      title: '',
      description: ''
    }
  })

  useEffect(() => {
    if (commitData && commitData.length > 0) {
      reset({
        title: commitData[commitData.length - 1]?.title,
        description: ''
      })
    }
  }, [commitData, reset])

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
      <SandboxLayout.Content className="px-20">
        <h1 className="text-24 text-foreground-1 mt-7 font-medium leading-snug tracking-tight">
          {t('views:pullRequests.compareChanges', 'Comparing changes')}
        </h1>
        <Layout.Vertical className="mt-2.5">
          <p className="text-14 text-foreground-2 max-w-xl leading-snug">
            {t(
              'views:pullRequests.compareChangesDescription',
              'Choose two branches to see what’s changed or to start a new pull request.'
            )}
          </p>
          <Layout.Horizontal className="items-center" gap="gap-x-2.5">
            <Icon name="compare" size={14} className="text-icons-1" />

            {branchSelectorRenderer}

            {/* Only render this block if isBranchSelected is true */}
            {isBranchSelected && !isLoading && (
              <Layout.Horizontal gap="gap-x-1" className="items-center">
                {mergeability ? (
                  <>
                    <Icon className="text-icons-success" name="tick" size={12} />
                    <p className="text-14 text-foreground-success leading-none">
                      {t('views:pullRequests.compareChangesAbleToMerge', 'Able to merge.')}{' '}
                      <span className="text-foreground-4">
                        {t(
                          'views:pullRequests.compareChangesAbleToMergeDescription',
                          'These branches can be automatically merged.'
                        )}
                      </span>
                    </p>
                  </>
                ) : (
                  <>
                    {apiError === "head branch doesn't contain any new commits." ? (
                      <>
                        <Icon name={'x-mark'} size={12} className="text-icons-1" />
                        <p className="text-14 text-foreground-4 leading-none">
                          {t(
                            'views:pullRequests.compareChangesApiError',
                            'Head branch doesn’t contain any new commits.'
                          )}
                        </p>
                      </>
                    ) : (
                      <>
                        <Icon className="text-icons-danger" name="x-mark" size={12} />
                        <p className="text-14 text-foreground-danger leading-none">
                          {t('views:pullRequests.compareChangesCantMerge', 'Can’t be merged.')}{' '}
                          <span className="text-foreground-4">
                            {t(
                              'views:pullRequests.compareChangesCantMergeDescription',
                              'You can still create the pull request.'
                            )}
                          </span>
                        </p>
                      </>
                    )}
                  </>
                )}
              </Layout.Horizontal>
            )}
          </Layout.Horizontal>
        </Layout.Vertical>
        {!prBranchCombinationExists && (
          <Layout.Horizontal className="border-borders-1 bg-background-2 mt-4 items-center justify-between rounded-md border p-4">
            <p className="text-14 leading-none">
              {isBranchSelected ? (
                <>
                  {t(
                    'views:pullRequests.compareChangesDiscussChanges',
                    'Discuss and review the changes in this comparison with others.'
                  )}{' '}
                  <StyledLink to="/">
                    {t('views:pullRequests.compareChangesDiscussChangesLink', 'Learn about pull requests.')}
                  </StyledLink>
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
              onFormDraftSubmit={onFormDraftSubmit}
              onFormSubmit={onFormSubmit}
              useTranslationStore={useTranslationStore}
            />
          </Layout.Horizontal>
        )}
        {prBranchCombinationExists && (
          <Layout.Horizontal className="border-borders-1 bg-background-2 mt-4 items-center justify-between rounded-md border p-4">
            <div className="flex items-center gap-x-1.5">
              <div>
                <Layout.Horizontal className="items-center">
                  <Icon name="compare" size={14} className="text-icons-success" />
                  <div className="flex gap-x-1">
                    {/* TODO: add the name of the PR instead this placeholder */}
                    <p className="text-14 text-foreground-1">{prBranchCombinationExists.title}</p>
                    <span className="text-foreground-4">{`#${prBranchCombinationExists.number}`}</span>
                  </div>
                </Layout.Horizontal>

                <p className="text-14  text-foreground-2">{prBranchCombinationExists.description}</p>
              </div>
            </div>
            <Button onClick={() => navigate(`../${prBranchCombinationExists.number}/conversation`)}>
              {t('views:pullRequests.compareChangesViewPRLink', 'View pull request')}
            </Button>
          </Layout.Horizontal>
        )}
        {isBranchSelected ? (
          <Layout.Vertical className="mt-10">
            <Tabs.Root variant="tabnav" defaultValue={prBranchCombinationExists ? 'commits' : 'overview'}>
              <Tabs.List className="before:bg-borders-4 relative left-1/2 w-[calc(100%+160px)] -translate-x-1/2 px-20">
                {!prBranchCombinationExists && (
                  <TabTriggerItem
                    value="overview"
                    icon="comments"
                    label={t('views:pullRequests.compareChangesTabOverview', 'Overview')}
                  />
                )}
                <TabTriggerItem
                  value="commits"
                  icon="tube-sign"
                  label={t('views:pullRequests.compareChangesTabCommits', 'Commits')}
                  badgeCount={diffStats.commits ? diffStats.commits : undefined}
                />
                <TabTriggerItem
                  value="changes"
                  icon="changes"
                  label={t('views:pullRequests.compareChangesTabChanges', 'Changes')}
                  badgeCount={diffStats.files_changed ? diffStats.files_changed : undefined}
                />
              </Tabs.List>
              {!prBranchCombinationExists && (
                <Tabs.Content className="pt-7" value="overview">
                  <div className="grid grid-cols-[1fr_288px] gap-x-8">
                    <div className="flex gap-x-3">
                      {currentUser && (
                        <Avatar.Root>
                          <Avatar.Fallback>{getInitials(currentUser)}</Avatar.Fallback>
                        </Avatar.Root>
                      )}
                      <div className="w-full">
                        <Spacer size={1} />
                        <PullRequestCompareForm
                          desc={desc}
                          setDesc={setDesc}
                          handleUpload={handleUpload}
                          register={register}
                          ref={formRef}
                          apiError={apiError}
                          isLoading={isLoading}
                          onFormDraftSubmit={onFormDraftSubmit}
                          onFormSubmit={onFormSubmit}
                          isValid={isValid}
                          errors={errors}
                          handleSubmit={handleSubmit}
                          useTranslationStore={useTranslationStore}
                        />
                      </div>
                    </div>
                    <PullRequestSideBar
                      addReviewers={handleAddReviewer}
                      usersList={usersList ?? []}
                      currentUserId={currentUser}
                      pullRequestMetadata={{ source_sha: '' }}
                      processReviewDecision={mockProcessReviewDecision}
                      refetchReviewers={noop}
                      handleDelete={handleDeleteReviewer}
                      reviewers={reviewers ?? []}
                      searchQuery={searchReviewersQuery}
                      setSearchQuery={setSearchReviewersQuery}
                      useTranslationStore={useTranslationStore}
                      labelsList={labelsList}
                      labelsValues={labelsValues}
                      PRLabels={PRLabels}
                      addLabel={addLabel}
                      removeLabel={removeLabel}
                      editLabelsProps={editLabelsProps}
                      searchLabelQuery={searchLabelQuery}
                      setSearchLabelQuery={setSearchLabelQuery}
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
                    iconName={'no-data-commits'}
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
                    diffData={diffData}
                    currentUser={currentUser}
                    diffStats={diffStats}
                    useTranslationStore={useTranslationStore}
                    jumpToDiff={jumpToDiff}
                    setJumpToDiff={setJumpToDiff}
                  />
                ) : (
                  <NoData
                    iconName="no-data-folder"
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
              iconName="no-data-pr"
              title={t('views:noData.compareChanges')}
              description={[t('views:noData.compareChangesDescription')]}
            />
          </>
        )}
      </SandboxLayout.Content>
    </SandboxLayout.Main>
  )
}
