import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import {
  OpenapiContentInfo,
  OpenapiGetContentOutput,
  UpdateRepositoryErrorResponse,
  useCalculateCommitDivergenceMutation,
  useCreateTokenMutation,
  useGetContentQuery,
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
  getTrimmedSha,
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
      navigate(routes.toRepoSummary({ spaceId, repoId, '*': fullGitRef }))
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
          requests: [{ from: fullGitRefWoDefault, to: repoData?.default_branch }]
        }
      })
    }
  }, [fullGitRefWoDefault, repoData?.default_branch, calculateDivergence])

  const { data: { body: readmeContent } = {} } = useGetContentQuery({
    path: 'README.md',
    repo_ref: repoRef,
    queryParams: { include_commit: false, git_ref: normalizeGitRef(fullGitRef) }
  })

  const decodedReadmeContent = useMemo(() => {
    return decodeGitContent(readmeContent?.content?.data)
  }, [readmeContent])

  const { data: { body: repoDetails } = {}, isLoading: isLoadingRepoDetails } = useGetContentQuery({
    path: '',
    repo_ref: repoRef,
    queryParams: { include_commit: true, git_ref: normalizeGitRef(fullGitRef) }
  })

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

  const repoEntryPathToFileTypeMap: Map<string, OpenapiGetContentOutput['type']> = useMemo(() => {
    const entries = repoDetails?.content?.entries

    if (!entries?.length) {
      return new Map()
    }
    const nonEmtpyPathEntries = entries.filter(entry => entry.path)

    return new Map(nonEmtpyPathEntries.map((entry: OpenapiContentInfo) => [entry.path, entry.type]))
  }, [repoDetails?.content?.entries])

  const { files, loading } = useRepoFileContentDetails({
    repoRef,
    fullGitRef,
    pathToTypeMap: repoEntryPathToFileTypeMap,
    spaceId,
    repoId
  })

  const { data: filesData } = useListPathsQuery({
    repo_ref: repoRef,
    queryParams: { git_ref: normalizeGitRef(fullGitRef || '') }
  })

  const filesList = filesData?.body?.files || []

  const navigateToFile = useCallback(
    (filePath: string) => {
      navigate(routes.toRepoFiles({ spaceId, repoId, '*': `${fullGitRef}/~/${filePath}` }))
    },
    [fullGitRef, navigate, repoId, spaceId]
  )

  const latestCommitInfo = useMemo(() => {
    const { author, message, sha } = repoDetails?.latest_commit || {}
    return {
      userName: author?.identity?.name || '',
      message: message || '',
      timestamp: author?.when ?? '',
      sha: sha ? getTrimmedSha(sha) : null
    }
  }, [repoDetails?.latest_commit])

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
        decodedReadmeContent={decodedReadmeContent}
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
            selectedBranch={{ name: gitRefName, sha: repoDetails?.latest_commit?.sha || '' }}
            preSelectedTab={preSelectedTab}
          />
        }
        toRepoFileDetails={({ path }: { path: string }) => path}
        tokenGenerationError={tokenGenerationError}
        toRepoCommits={() => toRepoCommits({ spaceId, repoId, fullGitRef, gitRefName })}
        toRepoBranches={() => routes.toRepoBranches({ spaceId, repoId })}
        toRepoTags={() => routes.toRepoTags({ spaceId, repoId })}
        toRepoPullRequests={() => routes.toRepoPullRequests({ spaceId, repoId })}
      />
      {showTokenDialog && createdTokenData && (
        <CloneCredentialDialog
          open={successTokenDialog}
          onClose={() => setSuccessTokenDialog(false)}
          navigateToManageToken={() => (isMFE ? customUtils.navigateToUserProfile() : navigate(routes.toProfileKeys()))}
          tokenData={createdTokenData}
        />
      )}
    </>
  )
}
