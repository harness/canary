import { FC, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import { Button, Icon, NoData, Spacer, StyledLink, Tabs, TabsContent, TabsList } from '@/components'
import { TypesDiffStats } from '@/types'
import {
  BranchSelectorListItem,
  BranchSelectorTab,
  CommitSelectorListItem,
  CommitsList,
  IBranchSelectorStore,
  SandboxLayout,
  TranslationStore,
  TypesCommit
} from '@/views'
import { zodResolver } from '@hookform/resolvers/zod'
import { Layout } from '@views/layouts/layout'
import { BranchSelector } from '@views/repo/components/branch-selector/branch-selector'
import { ICommitSelectorStore } from '@views/repo/components/commit-selector/types'
import PullRequestCompareButton from '@views/repo/pull-request/compare/components/pull-request-compare-button'
import PullRequestCompareForm from '@views/repo/pull-request/compare/components/pull-request-compare-form'
import TabTriggerItem from '@views/repo/pull-request/compare/components/pull-request-compare-tab-trigger-item'
import { z } from 'zod'

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

export interface PullRequestComparePageProps {
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
  prBranchCombinationExists: number | null
  useTranslationStore: () => TranslationStore
  useRepoBranchesStore: () => IBranchSelectorStore
  repoId?: string
  spaceId?: string
  useRepoCommitsStore: () => ICommitSelectorStore
  searchCommitQuery: string | null
  setSearchCommitQuery: (query: string | null) => void
  currentUser?: string
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
  currentUser
}) => {
  const { commits: commitData } = useRepoCommitsStore()
  const formRef = useRef<HTMLFormElement>(null) // Create a ref for the form
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false)
  const navigate = useNavigate()
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
    if (isSuccess === true) {
      reset()
      setIsSubmitted(true)
    }
  }, [isSuccess])

  const handleBranchSelection = () => {
    setIsBranchSelected(true) // Update state when a branch is selected
  }

  return (
    <SandboxLayout.Main fullWidth hasLeftPanel hasHeader hasSubHeader>
      <SandboxLayout.Content className="px-20">
        <p className="mt-7 text-24 font-medium leading-snug tracking-tight text-foreground-1">Comparing changes</p>
        <Layout.Vertical className="mt-2.5">
          <p className="max-w-xl text-14 leading-snug text-foreground-2">
            Choose two branches to see what&apos;s changed or to start a new pull request. If you need to, you can also{' '}
            <StyledLink to="/">compare across forks</StyledLink> or{' '}
            <StyledLink to="/">learn more about diff comparisons</StyledLink>.
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
            />

            {isBranchSelected &&
              !isLoading && ( // Only render this block if isBranchSelected is true
                <Layout.Horizontal gap="gap-x-1" className="items-center">
                  {mergeability ? (
                    <>
                      <Icon className="text-icons-success" name="tick" size={12} />
                      <p className="text-14 leading-none text-foreground-success">
                        Able to merge.{' '}
                        <span className="text-foreground-4">These branches can be automatically merged.</span>
                      </p>
                    </>
                  ) : (
                    <>
                      {apiError === "head branch doesn't contain any new commits." ? (
                        <>
                          <Icon name={'x-mark'} size={12} className="text-icons-1" />

                          <p className="text-14 leading-none text-foreground-4">
                            Head branch doesn&apos;t contain any new commits.
                          </p>
                        </>
                      ) : (
                        <>
                          <Icon className="text-icons-danger" name="tick" size={12} />
                          <p className="text-14 leading-none text-foreground-danger">
                            Can&apos;t be merged.{' '}
                            <span className="text-foreground-4">You can still create the pull request.</span>
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
                  Discuss and review the changes in this comparison with others.{' '}
                  <StyledLink to="/">Learn about pull requests.</StyledLink>
                </>
              ) : (
                'Choose different branches or forks above to discuss and review changes.'
              )}
            </p>
            <PullRequestCompareButton
              isSubmitted={isSubmitted}
              isValid={isValid}
              isLoading={isLoading}
              formRef={formRef}
              onFormDraftSubmit={onFormDraftSubmit}
              onFormSubmit={onFormSubmit}
            />
          </Layout.Horizontal>
        )}
        {prBranchCombinationExists && (
          <>
            <Layout.Horizontal className="items-center justify-between rounded-md border-2 border-border bg-background p-3">
              <div>
                <Layout.Horizontal className="py-2">
                  <p className="text-14 leading-none text-foreground-danger">
                    PR for this combination of branches already exists.
                  </p>
                </Layout.Horizontal>
              </div>
              {/* <ButtonGroup.Root> */}
              <Button
                className="h-8"
                size="md"
                // className="py-0.5"
                onClick={() => navigate(`../${prBranchCombinationExists}/conversation`)}
              >
                View Pull Request
              </Button>
              {/* </ButtonGroup.Root> */}
            </Layout.Horizontal>
          </>
        )}
        {isBranchSelected ? (
          <Layout.Vertical className="mt-10">
            <Tabs variant="branch" defaultValue="overview">
              <TabsList className="relative left-1/2 w-[calc(100%+160px)] -translate-x-1/2 px-20">
                <TabTriggerItem value="overview" icon="comments" label="Overview" />
                <TabTriggerItem
                  value="commits"
                  icon="tube-sign"
                  label="Commits"
                  badgeCount={diffStats.commits ? diffStats.commits : undefined}
                />
                <TabTriggerItem
                  value="changes"
                  icon="changes"
                  label="Changes"
                  badgeCount={diffStats.files_changed ? diffStats.files_changed : undefined}
                />
              </TabsList>
              <TabsContent className="pt-7" value="overview">
                <PullRequestCompareForm
                  register={register}
                  ref={formRef} // Pass the ref to the form
                  apiError={apiError}
                  isLoading={isLoading}
                  onFormDraftSubmit={onFormDraftSubmit}
                  onFormSubmit={onFormSubmit}
                  isValid={isValid}
                  errors={errors}
                  handleSubmit={handleSubmit}
                />
              </TabsContent>
              <TabsContent className="pt-7" value="commits">
                {/* TODO: add pagination to this */}
                <CommitsList
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
                <PullRequestCompareDiffList diffData={diffData} currentUser={currentUser} diffStats={diffStats} />
              </TabsContent>
            </Tabs>
          </Layout.Vertical>
        ) : (
          <>
            <Spacer size={10} />
            <NoData
              iconName="no-data-pr"
              title={'Compare and review just about anything'}
              description={['Branches, tags, commit ranges, and time ranges. In the same repository and across forks.']}
            />
          </>
        )}
      </SandboxLayout.Content>
    </SandboxLayout.Main>
  )
}
