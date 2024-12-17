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
  useListBranchesQuery,
  useListPathsQuery,
  useListTagsQuery,
  useSummaryQuery,
  useUpdateRepositoryMutation
} from '@harnessio/code-service-client'
import {
  BranchSelectorListItem,
  BranchSelectorTab,
  CommitDivergenceType,
  RepoFile,
  RepoSummaryView
} from '@harnessio/ui/views'
import { generateAlphaNumericHash, SummaryItemType } from '@harnessio/views'

import { useGetRepoRef } from '../../framework/hooks/useGetRepoPath'
import { useTranslationStore } from '../../i18n/stores/i18n-store'
import { timeAgoFromISOTime } from '../../pages/pipeline-edit/utils/time-utils'
import { TokenFormType } from '../../pages/profile-settings/token-create/token-create-form'
import { TokenSuccessDialog } from '../../pages/profile-settings/token-create/token-success-dialog'
import { PathParams } from '../../RouteDefinitions'
import { orderSortDate } from '../../types'
import { decodeGitContent, getTrimmedSha, normalizeGitRef, REFS_TAGS_PREFIX } from '../../utils/git-utils'
import { useRepoBranchesStore } from '././stores/repo-branches-store'
import { transformBranchList } from './transform-utils/branch-transform'

export default function RepoSummaryPage() {
  const [loading, setLoading] = useState(false)
  const [files, setFiles] = useState<RepoFile[]>([])
  const repoRef = useGetRepoRef()
  const navigate = useNavigate()
  const { spaceId, repoId } = useParams<PathParams>()
  const [gitRef, setGitRef] = useState<string>('')
  const [currBranchDivergence, setCurrBranchDivergence] = useState<CommitDivergenceType>({ ahead: 0, behind: 0 })
  const [branchTagQuery, setBranchTagQuery] = useState('')

  const {
    branchList,
    tagList,
    setBranchList,
    setTagList,
    setSpaceIdAndRepoId,
    setDefaultBranch,
    selectedBranchTag,
    setSelectedBranchTag,
    setSelectedRefType
  } = useRepoBranchesStore()

  const { data: { body: repository } = {}, refetch: refetchRepo } = useFindRepositoryQuery({ repo_ref: repoRef })

  const { data: { body: repoSummary } = {} } = useSummaryQuery({
    repo_ref: repoRef,
    queryParams: { include_commit: false, sort: 'date', order: 'asc', limit: 20, page: 1 }
  })

  const { branch_count, default_branch_commit_count, pull_req_summary, tag_count } = repoSummary || {}

  const { data: { body: branches } = {} } = useListBranchesQuery({
    repo_ref: repoRef,
    queryParams: { include_commit: false, sort: 'date', order: orderSortDate.ASC, limit: 50, query: branchTagQuery }
  })

  const { data: { body: branchDivergence = [] } = {}, mutate: calculateDivergence } =
    useCalculateCommitDivergenceMutation({
      repo_ref: repoRef
    })

  useEffect(() => {
    setSpaceIdAndRepoId(spaceId || '', repoId || '')
  }, [spaceId, repoId])

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

  const [createdTokenData, setCreatedTokenData] = useState<(TokenFormType & { token: string }) | null>(null)
  const [successTokenDialog, setSuccessTokenDialog] = useState(false)

  useEffect(() => {
    if (branches) {
      setBranchList(transformBranchList(branches, repository?.default_branch))
    }
    if (repository?.default_branch) {
      setDefaultBranch(repository?.default_branch)
    }
  }, [branches, repository?.default_branch])

  const { data: { body: tags } = {} } = useListTagsQuery({
    repo_ref: repoRef,
    queryParams: {
      include_commit: false,
      sort: 'date',
      order: orderSortDate.DESC,
      limit: 50,
      page: 1,
      query: branchTagQuery
    }
  })

  useEffect(() => {
    if (tags) {
      setTagList(
        tags.map(item => ({
          name: item?.name || '',
          sha: item?.sha || '',
          default: false
        }))
      )
    }
  }, [tags])

  const selectBranchOrTag = useCallback(
    (branchTagName: BranchSelectorListItem, type: BranchSelectorTab) => {
      if (type === BranchSelectorTab.BRANCHES) {
        const branch = branchList.find(branch => branch.name === branchTagName.name)
        if (branch) {
          setSelectedBranchTag(branch)
          setSelectedRefType(type)
          setGitRef(branch.name)
        }
      } else if (type === BranchSelectorTab.TAGS) {
        const tag = tagList.find(tag => tag.name === branchTagName.name)
        if (tag) {
          setSelectedBranchTag(tag)
          setSelectedRefType(type)
          setGitRef(`${REFS_TAGS_PREFIX + tag.name}`)
        }
      }
    },
    [navigate, repoId, spaceId, branchList, tagList]
  )

  useEffect(() => {
    if (selectedBranchTag?.name) {
      calculateDivergence({
        body: {
          requests: [{ from: selectedBranchTag.name, to: repository?.default_branch }]
        }
      })
    }
  }, [selectedBranchTag?.name])

  const { data: { body: readmeContent } = {} } = useGetContentQuery({
    path: 'README.md',
    repo_ref: repoRef,
    queryParams: { include_commit: false, git_ref: normalizeGitRef(gitRef || selectedBranchTag.name) }
  })

  const decodedReadmeContent = useMemo(() => {
    return decodeGitContent(readmeContent?.content?.data)
  }, [readmeContent])

  const { data: { body: repoDetails } = {}, isLoading: isLoadingRepoDetails } = useGetContentQuery({
    path: '',
    repo_ref: repoRef,
    queryParams: { include_commit: true, git_ref: normalizeGitRef(gitRef || selectedBranchTag.name) }
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
        setSuccessTokenDialog(true)
      }
    }
  )

  const handleCreateToken = () => {
    const body = {
      identifier: `code_token_${generateAlphaNumericHash(5)}`
    }
    createToken({ body })
  }

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
    setLoading(true)

    if (!repoEntryPathToFileTypeMap.size) {
      return
    }

    pathDetails({
      queryParams: { git_ref: normalizeGitRef(gitRef || selectedBranchTag?.name) },
      body: { paths: Array.from(repoEntryPathToFileTypeMap.keys()) },
      repo_ref: repoRef
    })
      .then(({ body: response }: { body: RepoPathsDetailsOutput }) => {
        if (response?.details && response.details.length) {
          setFiles(
            response.details.map((item: GitPathDetails) => ({
              id: item?.path || '',
              type: item?.path ? getSummaryItemType(repoEntryPathToFileTypeMap.get(item.path)) : SummaryItemType.File,
              name: item?.path || '',
              lastCommitMessage: item?.last_commit?.message || '',
              timestamp: item?.last_commit?.author?.when ? timeAgoFromISOTime(item.last_commit.author.when) : '',
              user: { name: item?.last_commit?.author?.identity?.name || '' },
              sha: item?.last_commit?.sha && getTrimmedSha(item.last_commit.sha),
              path: `/${spaceId}/repos/${repoId}/code/${gitRef}/~/${item?.path}`
            }))
          )
        }
      })
      .catch()
      .finally(() => {
        setLoading(false)
      })
  }, [repoEntryPathToFileTypeMap, selectedBranchTag?.name, repoRef, gitRef])

  useEffect(() => {
    const defaultBranch = branchList.find(branch => branch.default)
    setSelectedBranchTag({
      name: defaultBranch?.name || repository?.default_branch || '',
      sha: defaultBranch?.sha || '',
      default: true
    })
  }, [branchList, repository?.default_branch])

  const { data: filesData } = useListPathsQuery({
    repo_ref: repoRef,
    queryParams: { git_ref: normalizeGitRef(gitRef || selectedBranchTag.name) }
  })

  const filesList = filesData?.body?.files || []

  const navigateToFile = useCallback(
    (filePath: string) => {
      navigate(`${spaceId}/repos/${repoId}/code/${gitRef || selectedBranchTag.name}/~/${filePath}`)
    },
    [gitRef, selectedBranchTag, navigate, repoId, spaceId]
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
        selectBranchOrTag={selectBranchOrTag}
        useRepoBranchesStore={useRepoBranchesStore}
        updateRepoError={updateError}
        isEditDialogOpen={isEditDialogOpen}
        setEditDialogOpen={setEditDialogOpen}
        useTranslationStore={useTranslationStore}
        currentBranchDivergence={currBranchDivergence}
        searchQuery={branchTagQuery}
        setSearchQuery={setBranchTagQuery}
      />
      {createdTokenData && (
        <TokenSuccessDialog
          open={successTokenDialog}
          onClose={() => setSuccessTokenDialog(false)}
          tokenData={createdTokenData}
        />
      )}
    </>
  )
}
