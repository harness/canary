import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import {
  GitPathDetails,
  OpenapiContentInfo,
  OpenapiGetContentOutput,
  pathDetails,
  RepoPathsDetailsOutput,
  UpdateRepositoryErrorResponse,
  useCalculateCommitDivergenceMutation,
  useCreateTokenMutation,
  useFindRepositoryQuery,
  useGetContentQuery,
  useListPathsQuery,
  useSummaryQuery,
  useUpdateRepositoryMutation
} from '@harnessio/code-service-client'
import { generateAlphaNumericHash } from '@harnessio/ui/utils'
import {
  BranchSelectorListItem,
  BranchSelectorTab,
  CloneCredentialDialog,
  CommitDivergenceType,
  RepoFile,
  RepoSummaryView,
  SummaryItemType,
  TokenFormType
} from '@harnessio/ui/views'

import { BranchSelectorContainer } from '../../components-v2/branch-selector-container'
import { useAppContext } from '../../framework/context/AppContext'
import { useRoutes } from '../../framework/context/NavigationContext'
import { useGetRepoRef } from '../../framework/hooks/useGetRepoPath'
import { useIsMFE } from '../../framework/hooks/useIsMFE'
import { useMFEContext } from '../../framework/hooks/useMFEContext'
import { timeAgoFromISOTime } from '../../pages/pipeline-edit/utils/time-utils'
import { PathParams } from '../../RouteDefinitions'
import { sortFilesByType } from '../../utils/common-utils'
import { decodeGitContent, getTrimmedSha, normalizeGitRef, REFS_TAGS_PREFIX } from '../../utils/git-utils'

// import { useRepoBranchesStore } from './stores/repo-branches-store'

export default function RepoSummaryPage() {
  const routes = useRoutes()
  const [loading, setLoading] = useState(false)
  const [files, setFiles] = useState<RepoFile[]>([])
  const repoRef = useGetRepoRef()
  const navigate = useNavigate()
  const { spaceId, repoId } = useParams<PathParams>()
  const [gitRef, setGitRef] = useState<string>('')
  const [currBranchDivergence, setCurrBranchDivergence] = useState<CommitDivergenceType>({ ahead: 0, behind: 0 })
  const [branchTagQuery, setBranchTagQuery] = useState('')
  const [selectedBranchOrTag, setSelectedBranchOrTag] = useState<BranchSelectorListItem | null>(null)
  const [preSelectedTab, setPreSelectedTab] = useState<BranchSelectorTab>(BranchSelectorTab.BRANCHES)
  const [tokenGenerationError, setTokenGenerationError] = useState<string | null>(null)

  const { currentUser } = useAppContext()
  const isMFE = useIsMFE()
  const { customHooks, customUtils } = useMFEContext()

  const { data: { body: repository } = {}, refetch: refetchRepo } = useFindRepositoryQuery({ repo_ref: repoRef })

  const { data: { body: repoSummary } = {} } = useSummaryQuery({
    repo_ref: repoRef,
    queryParams: { include_commit: false, sort: 'date', order: 'asc', limit: 20, page: 1 }
  })

  const { branch_count, default_branch_commit_count, pull_req_summary, tag_count } = repoSummary || {}

  const { data: { body: branchDivergence = [] } = {}, mutate: calculateDivergence } =
    useCalculateCommitDivergenceMutation({
      repo_ref: repoRef
    })

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
      if (type === BranchSelectorTab.BRANCHES) {
        setGitRef(branchTagName.name)
        setSelectedBranchOrTag(branchTagName)
        setPreSelectedTab(BranchSelectorTab.BRANCHES)
      } else if (type === BranchSelectorTab.TAGS) {
        setGitRef(`${REFS_TAGS_PREFIX + branchTagName.name}`)
        setSelectedBranchOrTag(branchTagName)
        setPreSelectedTab(BranchSelectorTab.TAGS)
      }
    },
    [navigate, repoId, spaceId]
  )

  useEffect(() => {
    if (selectedBranchOrTag?.name) {
      calculateDivergence({
        body: {
          requests: [{ from: selectedBranchOrTag.name, to: repository?.default_branch }]
        }
      })
    }
  }, [calculateDivergence, repository?.default_branch, selectedBranchOrTag?.name])

  const { data: { body: readmeContent } = {} } = useGetContentQuery({
    path: 'README.md',
    repo_ref: repoRef,
    queryParams: { include_commit: false, git_ref: normalizeGitRef(gitRef || selectedBranchOrTag?.name) }
  })

  const decodedReadmeContent = useMemo(() => {
    return decodeGitContent(readmeContent?.content?.data)
  }, [readmeContent])

  const { data: { body: repoDetails } = {}, isLoading: isLoadingRepoDetails } = useGetContentQuery({
    path: '',
    repo_ref: repoRef,
    queryParams: { include_commit: true, git_ref: normalizeGitRef(gitRef || selectedBranchOrTag?.name) }
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

  const getSummaryItemType = (type: OpenapiGetContentOutput['type']): SummaryItemType => {
    if (type === 'dir') {
      return SummaryItemType.Folder
    }
    return SummaryItemType.File
  }

  useEffect(() => {
    if (!repoEntryPathToFileTypeMap.size) {
      return
    }
    setLoading(true)

    pathDetails({
      queryParams: { git_ref: normalizeGitRef(gitRef || selectedBranchOrTag?.name) },
      body: { paths: Array.from(repoEntryPathToFileTypeMap.keys()) },
      repo_ref: repoRef
    })
      .then(({ body: response }: { body: RepoPathsDetailsOutput }) => {
        if (response?.details && response.details.length) {
          setFiles(
            sortFilesByType(
              response.details.map((item: GitPathDetails) => ({
                id: item?.path || '',
                type: item?.path ? getSummaryItemType(repoEntryPathToFileTypeMap.get(item.path)) : SummaryItemType.File,
                name: item?.path || '',
                lastCommitMessage: item?.last_commit?.message || '',
                timestamp: item?.last_commit?.author?.when ? timeAgoFromISOTime(item.last_commit.author.when) : '',
                user: { name: item?.last_commit?.author?.identity?.name || '' },
                sha: item?.last_commit?.sha && getTrimmedSha(item.last_commit.sha),
                path: `${routes.toRepoFiles({ spaceId, repoId })}/${gitRef}/~/${item?.path}`
              }))
            )
          )
        }
      })
      .catch()
      .finally(() => {
        setLoading(false)
      })
  }, [repoEntryPathToFileTypeMap, selectedBranchOrTag?.name, repoRef, gitRef])

  const { data: filesData } = useListPathsQuery({
    repo_ref: repoRef,
    queryParams: { git_ref: normalizeGitRef(gitRef || selectedBranchOrTag?.name) }
  })

  const filesList = filesData?.body?.files || []

  const navigateToFile = useCallback(
    (filePath: string) => {
      navigate(`${routes.toRepoFiles({ spaceId, repoId })}/${gitRef || selectedBranchOrTag?.name}/~/${filePath}`)
    },
    [gitRef, selectedBranchOrTag, navigate, repoId, spaceId]
  )

  const latestCommitInfo = useMemo(() => {
    const { author, message, sha } = repoDetails?.latest_commit || {}
    return {
      userName: author?.identity?.name || '',
      message: message || '',
      timestamp: author?.when ? timeAgoFromISOTime(author.when) : '',
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
        selectedBranchOrTag={selectedBranchOrTag}
        toCommitDetails={({ sha }: { sha: string }) => routes.toRepoCommitDetails({ spaceId, repoId, commitSHA: sha })}
        loading={isLoading}
        filesList={filesList}
        navigateToFile={navigateToFile}
        repository={repository}
        handleCreateToken={handleCreateToken}
        repoEntryPathToFileTypeMap={repoEntryPathToFileTypeMap}
        files={files}
        decodedReadmeContent={decodedReadmeContent}
        summaryDetails={summaryDetails}
        gitRef={gitRef}
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
        isRepoEmpty={repository?.is_empty}
        refType={preSelectedTab}
        branchSelectorRenderer={
          <BranchSelectorContainer
            onSelectBranchorTag={selectBranchOrTag}
            selectedBranch={selectedBranchOrTag}
            preSelectedTab={preSelectedTab}
          />
        }
        toRepoFileDetails={({ path }: { path: string }) => path}
        tokenGenerationError={tokenGenerationError}
        toRepoCommits={() => routes.toRepoBranchCommits({ spaceId, repoId, branchId: selectedBranchOrTag?.name })}
        toRepoBranches={() => routes.toRepoBranches({ spaceId, repoId })}
        toRepoTags={() => routes.toRepoTags({ spaceId, repoId })}
        toRepoPullRequests={() => routes.toPullRequests({ spaceId, repoId })}
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
