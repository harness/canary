import { FC, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import {
  Avatar,
  AvatarFallback,
  Button,
  Icon,
  NoData,
  Spacer,
  StyledLink,
  Tabs,
  TabsContent,
  TabsList
} from '@/components'
import { TypesDiffStats } from '@/types'
import {
  BranchSelector,
  BranchSelectorListItem,
  BranchSelectorTab,
  CommitSelectorListItem,
  CommitsList,
  IBranchSelectorStore,
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

import { EnumPullReqReviewDecision, PRReviewer, PullReqReviewDecision } from '../pull-request.types'
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
  selectBranch: (branchTag: BranchSelectorListItem, type: BranchSelectorTab, sourceBranch: boolean) => void
  targetBranch: BranchSelectorListItem
  sourceBranch: BranchSelectorListItem
  diffData: HeaderProps[]
  diffStats: TypesDiffStats
  isBranchSelected: boolean
  setIsBranchSelected: (val: boolean) => void
  prBranchCombinationExists: { number: number; title: string; description: string } | null
  useTranslationStore: () => TranslationStore
  useRepoBranchesStore: () => IBranchSelectorStore
  repoId?: string
  spaceId?: string
  useRepoCommitsStore: () => ICommitSelectorStore
  searchCommitQuery: string | null
  setSearchCommitQuery: (query: string | null) => void
  currentUser?: string
  searchBranchQuery: string
  setSearchBranchQuery: (query: string) => void
  searchReviewersQuery: string
  setSearchReviewersQuery: (query: string) => void
  usersList?: { display_name?: string; id?: number; uid?: string }[]
  reviewers?: PRReviewer[]
  handleAddReviewer: (id?: number) => void
  handleDeleteReviewer: (id?: number) => void
}

export const PullRequestComparePage: FC<PullRequestComparePageProps> = ({
  onFormSubmit,
  apiError = null,
  isLoading,
  isSuccess,
  onFormDraftSubmit,
  mergeability = false,
  selectBranch,
  targetBranch,
  sourceBranch,
  diffData,
  diffStats,
  setIsBranchSelected,
  isBranchSelected,
  prBranchCombinationExists,
  useTranslationStore,
  useRepoBranchesStore,
  useRepoCommitsStore,
  currentUser,
  searchBranchQuery,
  setSearchBranchQuery,
  searchReviewersQuery,
  setSearchReviewersQuery,
  usersList,
  reviewers,
  handleAddReviewer,
  handleDeleteReviewer,
  toCommitDetails
}) => {
  const { commits: commitData } = useRepoCommitsStore()
  const formRef = useRef<HTMLFormElement>(null) // Create a ref for the form
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false)
  const navigate = useNavigate()
  const { t } = useTranslationStore()
  const {
    register,
    handleSubmit,
    reset,

    formState: { errors, isValid }
  } = useForm<CompareFormFields>({
    resolver: zodResolver(pullRequestFormSchema),
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

  const handleBranchSelection = () => {
    setIsBranchSelected(true) // Update state when a branch is selected
  }

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
        <span className="mt-7 text-24 font-medium leading-snug tracking-tight text-foreground-1">
          {t('views:pullRequests.compareChanges', 'Comparing changes')}
        </span>
        <Layout.Vertical className="mt-2.5">
          <p className="max-w-xl text-14 leading-snug text-foreground-2">
            {t(
              'views:pullRequests.compareChangesDescription',
              'Choose two branches to see what’s changed or to start a new pull request. If you need to, you can also'
            )}{' '}
            <StyledLink to="/">{t('views:pullRequests.compareChangesForkLink', 'compare across forks')}</StyledLink>{' '}
            {t('views:pullRequests.compareChangesOr', 'or')}{' '}
            <StyledLink to="/">
              {t('views:pullRequests.compareChangesDiffLink', 'learn more about diff comparisons')}
            </StyledLink>
            .
          </p>
          <Layout.Horizontal className="items-center" gap="gap-x-2.5">
            <Icon name="compare" size={14} className="text-icons-1" />
            <BranchSelector
              useTranslationStore={useTranslationStore}
              useRepoBranchesStore={useRepoBranchesStore}
              branchPrefix="base"
              selectedBranch={targetBranch}
              onSelectBranch={(branchTag, type) => {
                selectBranch(branchTag, type, false)
                handleBranchSelection()
              }}
              searchQuery={searchBranchQuery}
              setSearchQuery={setSearchBranchQuery}
            />

            <Icon name="arrow-long" size={12} className="rotate-180 text-icons-1" />
            <BranchSelector
              useTranslationStore={useTranslationStore}
              useRepoBranchesStore={useRepoBranchesStore}
              branchPrefix="compare"
              selectedBranch={sourceBranch}
              onSelectBranch={(branchTag, type) => {
                selectBranch(branchTag, type, true)
                handleBranchSelection()
              }}
              searchQuery={searchBranchQuery}
              setSearchQuery={setSearchBranchQuery}
            />

            {isBranchSelected &&
              !isLoading && ( // Only render this block if isBranchSelected is true
                <Layout.Horizontal gap="gap-x-1" className="items-center">
                  {mergeability ? (
                    <>
                      <Icon className="text-icons-success" name="tick" size={12} />
                      <p className="text-14 leading-none text-foreground-success">
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
                          <p className="text-14 leading-none text-foreground-4">
                            {t(
                              'views:pullRequests.compareChangesApiError',
                              'Head branch doesn’t contain any new commits.'
                            )}
                          </p>
                        </>
                      ) : (
                        <>
                          <Icon className="text-icons-danger" name="x-mark" size={12} />
                          <p className="text-14 leading-none text-foreground-danger">
                            {t('views:pullRequests.compareChangesCantMerge', 'Can’t be merged.')}{' '}
                            <span className="text-foreground-4">
                              {t(
                                'views:pullRequests.compareChangesCantMergeDesciption',
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
          <Layout.Horizontal className="mt-4 items-center justify-between rounded-md border border-borders-1 bg-background-2 p-4">
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
                  'Choose different branches or forks above to discuss and review changes.'
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
          <Layout.Horizontal className="mt-4 items-center justify-between rounded-md border border-borders-1 bg-background-2 p-4">
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
            <Tabs variant="tabnav" value={prBranchCombinationExists ? 'commits' : 'overview'}>
              <TabsList className="relative left-1/2 w-[calc(100%+160px)] -translate-x-1/2 px-20 before:bg-borders-4">
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
              </TabsList>
              {!prBranchCombinationExists && (
                <TabsContent className="pt-7" value="overview">
                  <div className="grid grid-cols-[1fr_288px] gap-x-8">
                    <div className="flex gap-x-3">
                      {currentUser && (
                        <Avatar className="overflow-hidden rounded-full" size="6">
                          <AvatarFallback>{getInitials(currentUser)}</AvatarFallback>
                        </Avatar>
                      )}
                      <div className="w-full">
                        <Spacer size={1} />
                        <PullRequestCompareForm
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
                    />
                  </div>
                </TabsContent>
              )}
              <TabsContent className="pt-7" value="commits">
                {/* TODO: add pagination to this */}
                <CommitsList
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
              </TabsContent>
              <TabsContent className="pt-7" value="changes">
                {/* Content for Changes */}
                <PullRequestCompareDiffList
                  diffData={diffData}
                  currentUser={currentUser}
                  diffStats={diffStats}
                  useTranslationStore={useTranslationStore}
                />
              </TabsContent>
            </Tabs>
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
