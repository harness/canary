import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import {
  OpenapiGetContentOutput,
  UpdateRepositoryErrorResponse,
  useCalculateCommitDivergenceMutation,
  useCreateTokenMutation,
  useGetContentQuery,
  useListCommitsQuery,
  useListPathsQuery,
  usePrCandidatesQuery,
  useSummaryQuery,
  useUpdateRepositoryMutation
} from '@harnessio/code-service-client'
import { generateAlphaNumericHash } from '@harnessio/ui/utils'
import {
  BranchSelectorListItem,
  BranchSelectorTab,
  CloneCredentialDialog,
  CommitDivergenceType,
  RepoSummaryView,
  TokenFormType
} from '@harnessio/ui/views'

import { BranchSelectorContainer } from '../../components-v2/branch-selector-container'
import { CreateBranchDialog } from '../../components-v2/create-branch-dialog'
import { useAppContext } from '../../framework/context/AppContext'
import { useRoutes } from '../../framework/context/NavigationContext'
import { useGetRepoRef } from '../../framework/hooks/useGetRepoPath'
import { useIsMFE } from '../../framework/hooks/useIsMFE'
import { useMFEContext } from '../../framework/hooks/useMFEContext'
import { useGitRef } from '../../hooks/useGitRef'
import { useRepoCommits } from '../../hooks/useRepoCommits'
import { useRepoFileContentDetails } from '../../hooks/useRepoFileContentDetails'
import { PathParams } from '../../RouteDefinitions'
import {
  decodeGitContent,
  isRefACommitSHA,
  isRefATag,
  normalizeGitRef,
  REFS_BRANCH_PREFIX,
  REFS_TAGS_PREFIX
} from '../../utils/git-utils'

export default function RepoSummaryPage() {
  const routes = useRoutes()
  const repoRef = useGetRepoRef()
  const navigate = useNavigate()
  const { spaceId, repoId } = useParams<PathParams>()
  const [currBranchDivergence, setCurrBranchDivergence] = useState<CommitDivergenceType>({ ahead: 0, behind: 0 })
  const [branchTagQuery, setBranchTagQuery] = useState('')
  const [tokenGenerationError, setTokenGenerationError] = useState<string | null>(null)
  const [isCreateBranchDialogOpen, setCreateBranchDialogOpen] = useState(false)
  const [branchQueryForNewBranch, setBranchQueryForNewBranch] = useState<string>('')

  const { currentUser } = useAppContext()
  const isMFE = useIsMFE()
  const { customHooks, customUtils } = useMFEContext()

  const { toRepoCommits } = useRepoCommits()
  const {
    fullGitRef,
    gitRefName,
    fullGitRefWoDefault,
    repoData,
    refetchRepo,
    preSelectedTab,
    setPreSelectedTab,
    prefixedDefaultBranch
  } = useGitRef()

  const { data: { body: repoSummary } = {} } = useSummaryQuery({
    repo_ref: repoRef,
    queryParams: { include_commit: false, sort: 'date', order: 'asc', limit: 20, page: 1 }
  })

  const { branch_count, default_branch_commit_count, pull_req_summary, tag_count } = repoSummary || {}

  const { data: { body: branchDivergence = [] } = {}, mutate: calculateDivergence } =
    useCalculateCommitDivergenceMutation({
      repo_ref: repoRef
    })

  const { data: { body: prCandidateBranches } = {} } = usePrCandidatesQuery({ repo_ref: repoRef, queryParams: {} })

  // Navigate to default branch if no branch is selected
  useEffect(() => {
    if (!fullGitRefWoDefault && prefixedDefaultBranch && fullGitRef) {
      navigate(routes.toRepoSummary({ spaceId, repoId, '*': fullGitRef }), { replace: true })
    }
  }, [fullGitRefWoDefault, prefixedDefaultBranch, fullGitRef])

  useEffect(() => {
    if (branchDivergence.length) {
      setCurrBranchDivergence(branchDivergence[0])
    }
  }, [branchDivergence])

  const [updateError, setUpdateError] = useState<string>('')

  const [isEditDialogOpen, setEditDialogOpen] = useState(false)

  const updateDescription = useUpdateRepositoryMutation(
    { repo_ref: repoRef },
    {
      onSuccess: () => {
        refetchRepo()
        setEditDialogOpen(false)
      },
      onError: (error: UpdateRepositoryErrorResponse) => {
        const errormsg = error?.message || 'An unknown error occurred.'
        setUpdateError(errormsg)
      }
    }
  )

  const saveDescription = (description: string) => {
    updateDescription.mutate({
      body: {
        description: description
      }
    })
  }

  useEffect(() => {
    setUpdateError('')
  }, [isEditDialogOpen])

  const [MFETokenFlag, setMFETokenFlag] = useState(false)
  const [showTokenDialog, setShowTokenDialog] = useState(false)
  const [tokenHash, setTokenHash] = useState('')
  const MFEtokenData = isMFE
    ? customHooks.useGenerateToken(MFETokenFlag ? tokenHash : '', currentUser?.uid || '', MFETokenFlag)
    : null
  const [createdTokenData, setCreatedTokenData] = useState<(TokenFormType & { token: string }) | null>(null)
  const [successTokenDialog, setSuccessTokenDialog] = useState(false)

  const selectBranchOrTag = useCallback(
    (branchTagName: BranchSelectorListItem, type: BranchSelectorTab) => {
      const newRef =
        type === BranchSelectorTab.TAGS
          ? `${REFS_TAGS_PREFIX + branchTagName.name}`
          : `${REFS_BRANCH_PREFIX + branchTagName.name}`
      setPreSelectedTab(type)
      navigate(routes.toRepoSummary({ spaceId, repoId, '*': newRef }))
    },
    [navigate, repoId, spaceId, routes]
  )

  useEffect(() => {
    if (fullGitRefWoDefault && repoData?.default_branch) {
      calculateDivergence({
        repo_ref: repoRef,
        body: {
          requests: [{ from: normalizeGitRef(fullGitRefWoDefault), to: normalizeGitRef(repoData?.default_branch) }]
        }
      })
    }
  }, [fullGitRefWoDefault, repoData?.default_branch, calculateDivergence])

  const {
    data: { body: repoDetails } = {},
    isLoading: isLoadingRepoDetails,
    error: contentError
  } = useGetContentQuery({
    path: '',
    repo_ref: repoRef,
    queryParams: {
      include_commit: true,
      git_ref: normalizeGitRef(fullGitRef)
    }
  })

  // Fallback: If content API doesn't return commit info, try commits API
  const {
    data: { body: commitsData } = {},
    isLoading: _isLoadingCommits,
    refetch: refetchCommits
  } = useListCommitsQuery({
    repo_ref: repoRef,
    queryParams: {
      git_ref: normalizeGitRef(fullGitRef),
      limit: 1,
      page: 1
    }
  })

  // Determine if we should use fallback data as primary
  const shouldUseFallback = useMemo(() => {
    return !repoDetails?.latest_commit || contentError
  }, [repoDetails?.latest_commit, contentError])

  const { mutate: createToken } = useCreateTokenMutation(
    { body: {} },
    {
      onSuccess: ({ body: newToken }) => {
        const tokenData = {
          identifier: newToken.token?.identifier ?? 'Unknown',
          lifetime: newToken.token?.expires_at
            ? new Date(newToken.token.expires_at).toLocaleDateString()
            : 'No Expiration',
          token: newToken.access_token ?? 'Token not available'
        }
        setCreatedTokenData(tokenData)
        setShowTokenDialog(true)
        setSuccessTokenDialog(true)
      }
    }
  )

  const handleCreateToken = () => {
    if (isMFE) {
      const mfeTokenHash = generateAlphaNumericHash(5)
      setTokenHash(mfeTokenHash)
      setMFETokenFlag(true)
    } else {
      const body = {
        identifier: `code_token_${generateAlphaNumericHash(5)}`
      }
      createToken({ body })
    }
  }
  useEffect(() => {
    if (MFEtokenData && MFEtokenData.status === 'SUCCESS') {
      const tokenDataNew = {
        identifier: `code_token_${tokenHash}`,
        lifetime: MFEtokenData.token?.expires_at
          ? new Date(MFEtokenData.token.expires_at).toLocaleDateString()
          : 'No Expiration',
        token: MFEtokenData.data ?? 'Token not available'
      }
      setCreatedTokenData(tokenDataNew)
      setShowTokenDialog(true)
      setSuccessTokenDialog(true)
      setMFETokenFlag(false)
      setTokenGenerationError(null)
    } else if (MFEtokenData && MFEtokenData.data.status === 'ERROR') {
      setTokenGenerationError(MFEtokenData.data.message)
    }
  }, [MFEtokenData, tokenHash])

  const showContributeBtn = useMemo(() => {
    return gitRefName !== repoData?.default_branch && !isRefACommitSHA(fullGitRef) && !isRefATag(fullGitRef)
  }, [repoData?.default_branch, gitRefName])

  // Get file paths from the working paths API
  const { data: filesData } = useListPathsQuery({
    repo_ref: repoRef,
    queryParams: { git_ref: normalizeGitRef(fullGitRef || '') }
  })

  const repoEntryPathToFileTypeMap: Map<string, OpenapiGetContentOutput['type']> = useMemo(() => {
    // Use the working paths API data instead of the failing content API
    const paths = filesData?.body?.files || []

    if (!paths.length) {
      return new Map()
    }

    // This ensures we use the working API data instead of stale content API data
    return new Map(paths.map(path => [path, 'file' as OpenapiGetContentOutput['type']]))
  }, [filesData?.body?.files]) // Changed dependency to use working API data

  //find README info from the working paths API
  const readmeInfo = useMemo(() => {
    const paths = filesData?.body?.files || []
    const readmePath = paths.find(path => /^readme\.md$/i.test(path))

    return readmePath
      ? {
          name: 'README.md',
          path: readmePath,
          type: 'file' as const
        }
      : undefined
  }, [filesData?.body?.files])

  // Fetch README content only when readmeInfo exists
  const { data: { body: readmeContent } = {} } = useGetContentQuery(
    {
      path: 'README.md',
      repo_ref: repoRef,
      queryParams: { include_commit: false, git_ref: normalizeGitRef(fullGitRef) }
    },
    {
      // Only fetch content when README file actually exists
      enabled: !!readmeInfo?.path
    }
  )

  // Prepare README info with content for the UI component
  const readmeInfoWithContent = useMemo(() => {
    if (!readmeInfo?.path || !readmeContent?.content?.data) return undefined

    return {
      name: readmeInfo.name,
      path: readmeInfo.path,
      type: readmeInfo.type,
      content: decodeGitContent(readmeContent.content.data)
    }
  }, [readmeInfo, readmeContent])

  // Force refresh commits data when file list changes to get updated commit information
  useEffect(() => {
    if (filesData?.body?.files) {
      // Refetch commits to ensure we have the latest commit info after file changes
      refetchCommits()
    }
  }, [filesData?.body?.files, refetchCommits])

  const { files, loading, scheduleFileMetaFetch } = useRepoFileContentDetails({
    repoRef,
    fullGitRef,
    fullResourcePath: '',
    pathToTypeMap: repoEntryPathToFileTypeMap,
    spaceId,
    repoId,
    forceRefresh: true // Always force refresh when file list changes
  })

  const filesList = filesData?.body?.files || []

  const navigateToFile = useCallback(
    (filePath: string) => {
      navigate(routes.toRepoFiles({ spaceId, repoId, '*': `${fullGitRef}/~/${filePath}` }))
    },
    [fullGitRef, navigate, repoId, spaceId]
  )

  const latestCommitInfo = useMemo(() => {
    // Helper function to validate and parse timestamp
    const parseTimestamp = (timestamp: string | undefined): string => {
      if (!timestamp) return ''
      const date = new Date(timestamp)
      return !isNaN(date.getTime()) ? timestamp : ''
    }

    // Helper function to get commit data with fallbacks
    const getCommitData = (primaryCommit: any, fallbackCommit: any) => {
      const commitObj = primaryCommit || fallbackCommit
      return {
        timestamp: parseTimestamp(commitObj?.author?.when) || '',
        message: commitObj?.message || 'No commit information available',
        sha: commitObj?.sha || 'N/A',
        userName: commitObj?.author?.identity?.name || 'Unknown'
      }
    }

    // If primary API failed, use fallback data directly
    if (shouldUseFallback && commitsData?.commits?.[0]) {
      return getCommitData(null, commitsData.commits[0])
    }

    // Try to use primary API data with fallback
    const primaryCommit = repoDetails?.latest_commit
    const fallbackCommit = commitsData?.commits?.[0]

    return getCommitData(primaryCommit, fallbackCommit)
  }, [repoDetails?.latest_commit, commitsData, shouldUseFallback])

  const summaryDetails = useMemo(
    () => ({
      default_branch_commit_count,
      branch_count,
      tag_count,
      pull_req_summary: pull_req_summary ? { open_count: pull_req_summary.open_count || 0 } : undefined
    }),
    [default_branch_commit_count, branch_count, tag_count, pull_req_summary]
  )

  const isLoading = loading || isLoadingRepoDetails

  return (
    <>
      <RepoSummaryView
        repoId={repoId ?? ''}
        spaceId={spaceId ?? ''}
        selectedBranchOrTag={{ name: gitRefName, sha: repoDetails?.latest_commit?.sha || '' }}
        toCommitDetails={({ sha }: { sha: string }) => routes.toRepoCommitDetails({ spaceId, repoId, commitSHA: sha })}
        loading={isLoading}
        filesList={filesList}
        navigateToFile={navigateToFile}
        prCandidateBranches={prCandidateBranches}
        repository={repoData}
        handleCreateToken={handleCreateToken}
        repoEntryPathToFileTypeMap={repoEntryPathToFileTypeMap}
        files={files}
        readmeInfo={readmeInfoWithContent}
        summaryDetails={summaryDetails}
        gitRef={fullGitRef}
        latestCommitInfo={latestCommitInfo}
        saveDescription={saveDescription}
        updateRepoError={updateError}
        isEditDialogOpen={isEditDialogOpen}
        setEditDialogOpen={setEditDialogOpen}
        currentBranchDivergence={currBranchDivergence}
        searchQuery={branchTagQuery}
        setSearchQuery={setBranchTagQuery}
        toRepoFiles={() => routes.toRepoFiles({ spaceId, repoId })}
        navigateToProfileKeys={() => (isMFE ? customUtils.navigateToUserProfile() : navigate(routes.toProfileKeys()))}
        isRepoEmpty={repoData?.is_empty}
        refType={preSelectedTab}
        branchSelectorRenderer={
          <BranchSelectorContainer
            onSelectBranchorTag={selectBranchOrTag}
            setCreateBranchDialogOpen={setCreateBranchDialogOpen}
            selectedBranch={{ name: gitRefName, sha: repoDetails?.latest_commit?.sha || '' }}
            preSelectedTab={preSelectedTab}
            onBranchQueryChange={setBranchQueryForNewBranch}
          />
        }
        toRepoFileDetails={({ path }: { path: string }) => path}
        tokenGenerationError={tokenGenerationError}
        toRepoCommits={() => toRepoCommits({ spaceId, repoId, fullGitRef, gitRefName })}
        toRepoBranches={() => routes.toRepoBranches({ spaceId, repoId })}
        toRepoTags={() => routes.toRepoTags({ spaceId, repoId })}
        toRepoPullRequests={() => routes.toRepoPullRequests({ spaceId, repoId })}
        showContributeBtn={showContributeBtn}
        scheduleFileMetaFetch={scheduleFileMetaFetch}
      />
      <CreateBranchDialog
        open={isCreateBranchDialogOpen}
        onClose={() => setCreateBranchDialogOpen(false)}
        onSuccess={() => navigate(routes.toRepoSummary({ spaceId, repoId, '*': branchQueryForNewBranch }))}
        onBranchQueryChange={setBranchQueryForNewBranch}
        preselectedBranchOrTag={fullGitRef ? { name: gitRefName, sha: '' } : null}
        preselectedTab={preSelectedTab}
        prefilledName={branchQueryForNewBranch}
      />
      {showTokenDialog && createdTokenData && (
        <CloneCredentialDialog
          open={successTokenDialog}
          onClose={() => setSuccessTokenDialog(false)}
          navigateToManageToken={() => (isMFE ? customUtils.navigateToUserProfile() : navigate(routes.toProfileKeys()))}
          tokenData={createdTokenData}
        />
      )}
      <CreateBranchDialog
        open={isCreateBranchDialogOpen}
        onClose={() => setCreateBranchDialogOpen(false)}
        onSuccess={() => {
          setCreateBranchDialogOpen(false)
          navigate(routes.toRepoFiles({ spaceId, repoId, '*': branchQueryForNewBranch }))
        }}
        onBranchQueryChange={setBranchQueryForNewBranch}
        preselectedBranchOrTag={fullGitRef ? { name: gitRefName, sha: '' } : null}
        preselectedTab={preSelectedTab}
        prefilledName={branchQueryForNewBranch}
      />
    </>
  )
}
