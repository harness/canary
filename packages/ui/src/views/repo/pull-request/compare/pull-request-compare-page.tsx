import { FC, ReactElement, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'

import { Avatar, Button, IconV2, Layout, Link, LinkProps, NoData, Skeleton, Tabs, Text } from '@/components'
import { TFunctionWithFallback, useRouterContext, useTranslation } from '@/context'
import { TypesDiffStats, TypesUser } from '@/types'
import {
  CommitSelectorListItem,
  CommitsList,
  HandleAiPullRequestSummaryType,
  HandleUploadType,
  ICommitSelectorStore,
  ILabelType,
  LabelValuesType,
  PrincipalPropsType,
  PullRequestSideBar,
  SandboxLayout,
  TypesCommit
} from '@/views'
import { zodResolver } from '@hookform/resolvers/zod'
import PullRequestCompareButton from '@views/repo/pull-request/compare/components/pull-request-compare-button'
import PullRequestCompareForm from '@views/repo/pull-request/compare/components/pull-request-compare-form'
import { combineAndNormalizePrincipalsAndGroups } from '@views/repo/utils'
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

export const getPullRequestFormSchema = (t: TFunctionWithFallback) =>
  z.object({
    title: z
      .string()
      .trim()
      .min(1, { message: t('views:pullRequests.validation.titleMin', 'Title is required') })
      .max(256, {
        message: t('views:pullRequests.validation.titleMax', 'Title must be no longer than 256 characters')
      }),
    description: z.string().optional()
  })

export type CompareFormFields = z.infer<ReturnType<typeof getPullRequestFormSchema>>

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
  setIsBranchSelected?: (val: boolean) => void
  prBranchCombinationExists: { number: number; title: string; description: string } | null
  repoId?: string
  spaceId?: string
  useRepoCommitsStore: () => ICommitSelectorStore
  searchCommitQuery: string | null
  setSearchCommitQuery: (query: string | null) => void
  currentUser?: TypesUser

  reviewers?: PRReviewer[]
  userGroupReviewers?: PRReviewer[]
  handleAddReviewer: (id?: number) => void
  handleAddUserGroupReviewer: (id?: number) => void
  handleDeleteReviewer: (id?: number) => void
  handleDeleteUserGroupReviewer: (id?: number) => void
  handleUpload?: HandleUploadType
  desc?: string
  setDesc: (desc: string) => void
  prTemplate?: string
  isFetchingCommits?: boolean
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
  targetBranch?: string
  isLabelsLoading?: boolean
}

export const PullRequestComparePage: FC<PullRequestComparePageProps> = ({
  onFormSubmit,
  apiError = null,
  isLoading,
  isSuccess,
  onFormDraftSubmit,
  mergeability,
  handleAiPullRequestSummary,

  diffData,
  diffStats,
  isBranchSelected,
  prBranchCombinationExists,
  useRepoCommitsStore,
  currentUser,

  principalProps,
  reviewers,
  userGroupReviewers,
  handleAddReviewer,
  handleAddUserGroupReviewer,
  handleDeleteReviewer,
  handleDeleteUserGroupReviewer,
  toCommitDetails,
  toCode,
  handleUpload,
  desc,
  setDesc,
  prTemplate,
  isFetchingCommits,
  onGetFullDiff,
  toRepoFileDetails,
  sourceBranch,
  targetBranch,

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

  const [activeTab, setActiveTab] = useState(prBranchCombinationExists ? 'commits' : 'overview')

  useEffect(() => {
    setActiveTab(prBranchCombinationExists ? 'commits' : 'overview')
  }, [prBranchCombinationExists])

  const formMethods = useForm<CompareFormFields>({
    resolver: zodResolver(getPullRequestFormSchema(t)),
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

  const isNoNewCommits = !diffStats.commits

  return (
    <SandboxLayout.Main fullWidth>
      <SandboxLayout.Content>
        <Layout.Vertical gapY="lg" className="grow">
          <Layout.Vertical gapY="md">
            <Layout.Vertical gapY="xs">
              <Text variant="heading-section">{t('views:pullRequests.compareChanges', 'Comparing changes')}</Text>
              <Text className="max-w-xl">
                {t(
                  'views:pullRequests.compareChangesDescription',
                  'Choose two branches to see what’s changed or to start a new pull request.'
                )}
              </Text>
            </Layout.Vertical>

            <Layout.Horizontal align="center" gap="xs">
              {branchSelectorRenderer}

              {mergeability !== undefined && !isLoading && (
                <Layout.Horizontal gap="3xs" align="center">
                  {mergeability === true && (
                    <>
                      <IconV2 name="check" color="success" />
                      <Text variant="body-single-line-normal" color="success">
                        {t('views:pullRequests.compareChangesAbleToMerge', 'Able to merge.')}
                      </Text>
                      <Text variant="body-single-line-normal" as="span" color="foreground-2">
                        {t(
                          'views:pullRequests.compareChangesAbleToMergeDescription',
                          'These branches can be automatically merged.'
                        )}
                      </Text>
                    </>
                  )}
                  {mergeability === false && (
                    <>
                      {apiError === "head branch doesn't contain any new commits." ? (
                        <>
                          <IconV2 name="xmark" className="text-cn-3" />
                          <Text variant="body-single-line-normal">
                            {t(
                              'views:pullRequests.compareChangesApiError',
                              'Head branch doesn’t contain any new commits.'
                            )}
                          </Text>
                        </>
                      ) : (
                        <>
                          <IconV2 color="danger" name="xmark" />
                          <Text variant="body-single-line-normal" color="danger">
                            {t('views:pullRequests.compareChangesCantMerge', 'Can’t be merged.')}
                          </Text>
                          <Text variant="body-single-line-normal">
                            {t(
                              'views:pullRequests.compareChangesCantMergeDescription',
                              'You can still create the pull request.'
                            )}
                          </Text>
                        </>
                      )}
                    </>
                  )}
                </Layout.Horizontal>
              )}
            </Layout.Horizontal>
          </Layout.Vertical>

          {!prBranchCombinationExists && !isNoNewCommits && (
            <Layout.Horizontal
              align="center"
              justify="between"
              className="border-cn-3 bg-cn-2 px-cn-md py-cn-sm rounded-2 border"
            >
              <Text variant="body-normal" color="foreground-1">
                {t(
                  'views:pullRequests.compareChangesDiscussChanges',
                  'Discuss and review the changes in this comparison with others.'
                )}{' '}
                <Link
                  to="https://www.harness.io/harness-devops-academy/pull-request"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-[inherit]"
                >
                  {t('views:pullRequests.compareChangesDiscussChangesLink', 'Learn about pull requests.')}
                </Link>
              </Text>
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
              className="border-cn-3 bg-cn-2 px-cn-md py-cn-sm rounded-2 border"
            >
              <Layout.Grid gapY="2xs">
                <Layout.Grid flow="column" align="center" gapX="2xs" justify="start">
                  <IconV2 name="git-compare" color="success" />
                  {/* TODO: add the name of the PR instead this placeholder */}
                  <Text variant="body-strong" color="foreground-1" truncate>
                    {prBranchCombinationExists.title}
                  </Text>
                  <Text>{`#${prBranchCombinationExists.number}`}</Text>
                </Layout.Grid>
                {prBranchCombinationExists.description && (
                  <Text lineClamp={2}>{prBranchCombinationExists.description}</Text>
                )}
              </Layout.Grid>
              <Button
                onClick={() =>
                  navigate(toPullRequestConversation?.({ pullRequestId: prBranchCombinationExists.number }) ?? '')
                }
              >
                {t('views:pullRequests.compareChangesViewPRLink', 'View pull request')}
              </Button>
            </Layout.Horizontal>
          )}

          {isBranchSelected && (
            <>
              {!isNoNewCommits && (
                <Layout.Vertical>
                  <Tabs.Root value={activeTab} onValueChange={val => setActiveTab(val)}>
                    <Tabs.List variant="overlined" className="-mx-cn-2xl px-cn-2xl">
                      {!prBranchCombinationExists && (
                        <Tabs.Trigger value="overview" icon="info-circle">
                          {t('views:pullRequests.compareChangesTabOverview', 'Overview')}
                        </Tabs.Trigger>
                      )}
                      <Tabs.Trigger value="commits" icon="git-commit" counter={diffStats?.commits}>
                        {t('views:pullRequests.compareChangesTabCommits', 'Commits')}
                      </Tabs.Trigger>
                      <Tabs.Trigger value="changes" icon="empty-page" counter={diffStats?.files_changed}>
                        {t('views:pullRequests.compareChangesTabChanges', 'Changes')}
                      </Tabs.Trigger>
                    </Tabs.List>
                    {!prBranchCombinationExists && (
                      <Tabs.Content className="pt-cn-lg" value="overview">
                        <Layout.Flex gap="xl">
                          <Layout.Horizontal className="flex-1" gap="sm">
                            {currentUser && <Avatar name={currentUser?.display_name} rounded />}
                            <div className="flex-1">
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
                          </Layout.Horizontal>
                          <div className="w-[344px]">
                            <PullRequestSideBar
                              isReviewersLoading={principalProps?.isPrincipalsLoading}
                              isLabelsLoading={isLabelsLoading}
                              addReviewer={handleAddReviewer}
                              addUserGroupReviewer={handleAddUserGroupReviewer}
                              authorId={currentUser?.id}
                              pullRequestMetadata={{ source_sha: '' }}
                              processReviewDecision={mockProcessReviewDecision}
                              refetchReviewers={noop}
                              handleDelete={handleDeleteReviewer}
                              handleUserGroupReviewerDelete={handleDeleteUserGroupReviewer}
                              reviewers={reviewers ?? []}
                              userGroupReviewers={userGroupReviewers ?? []}
                              searchQuery={principalProps?.searchPrincipalsQuery || ''}
                              setSearchQuery={principalProps?.setSearchPrincipalsQuery || noop}
                              usersList={combineAndNormalizePrincipalsAndGroups(
                                principalProps?.principals ?? [],
                                principalProps?.userGroups ?? []
                              )}
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
                        </Layout.Flex>
                      </Tabs.Content>
                    )}
                    <Tabs.Content className="pt-cn-lg" value="commits">
                      {/* TODO: add pagination to this */}
                      {isFetchingCommits ? (
                        <Skeleton.List />
                      ) : (
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
                      )}
                    </Tabs.Content>
                    <Tabs.Content value="changes">
                      {/* Content for Changes */}
                      {(diffData ?? []).length > 0 ? (
                        <PullRequestCompareDiffList
                          principalProps={principalProps}
                          diffData={diffData}
                          currentUser={currentUser}
                          diffStats={diffStats}
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
              )}
              {isNoNewCommits && (
                <NoData
                  withBorder
                  imageName="no-data-folder"
                  title={t('views:noData.pullRequests.noNewCommits', 'There isn’t anything to compare')}
                  description={[
                    t('views:noData.pullRequests.noNewCommitsDescription', `{{source}} and {{target}} are identical.`, {
                      source: sourceBranch,
                      target: targetBranch
                    })
                  ]}
                />
              )}
            </>
          )}
          {!isBranchSelected && (
            <NoData
              withBorder
              imageName="no-data-pr"
              title={t('views:noData.compareChanges', 'Compare and review just about anything')}
              description={[
                t(
                  'views:noData.compareChangesDescription',
                  'Branches and commit ranges can be reviewed within the same repository.'
                )
              ]}
            />
          )}
        </Layout.Vertical>
      </SandboxLayout.Content>
    </SandboxLayout.Main>
  )
}
