import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import {
  GitPathDetails,
  OpenapiContentInfo,
  OpenapiGetContentOutput,
  pathDetails,
  RepoPathsDetailsOutput,
  useCreateTokenMutation,
  useFindRepositoryQuery,
  useGetContentQuery,
  useListBranchesQuery,
  useListPathsQuery,
  useSummaryQuery
} from '@harnessio/code-service-client'
import { BranchSelectorListItem, RepoFile, RepoSummaryView } from '@harnessio/ui/views'
import { generateAlphaNumericHash, SummaryItemType, useCommonFilter } from '@harnessio/views'

import { useGetRepoRef } from '../../framework/hooks/useGetRepoPath'
import { timeAgoFromISOTime } from '../../pages/pipeline-edit/utils/time-utils'
import { TokenFormType } from '../../pages/profile-settings/token-create/token-create-form'
import { TokenSuccessDialog } from '../../pages/profile-settings/token-create/token-success-dialog'
import { PathParams } from '../../RouteDefinitions'
import { decodeGitContent, getTrimmedSha, normalizeGitRef } from '../../utils/git-utils'

export default function RepoSummaryPage() {
  const [loading, setLoading] = useState(false)
  const [files, setFiles] = useState<RepoFile[]>([])
  const repoRef = useGetRepoRef()
  const navigate = useNavigate()
  const { spaceId, repoId, gitRef } = useParams<PathParams>()

  const { data: { body: repository } = {} } = useFindRepositoryQuery({ repo_ref: repoRef })

  const { data: { body: branches } = {} } = useListBranchesQuery({
    repo_ref: repoRef,
    queryParams: { include_commit: false, sort: 'date', order: 'asc', limit: 20, page: 1, query: '' }
  })

  const [selectedBranch, setSelectedBranch] = useState<BranchSelectorListItem>({
    name: '',
    sha: ''
  })

  const [createdTokenData, setCreatedTokenData] = useState<(TokenFormType & { token: string }) | null>(null)
  const [successTokenDialog, setSuccessTokenDialog] = useState(false)

  const { query } = useCommonFilter()

  const branchList: BranchSelectorListItem[] = useMemo(() => {
    if (!branches) return []

    return branches.map(item => ({
      name: item?.name || '',
      sha: item?.sha || '',
      default: item?.name === repository?.default_branch
    }))
  }, [branches, repository?.default_branch])

  const { data: { body: repoSummary } = {} } = useSummaryQuery({
    repo_ref: repoRef,
    queryParams: { include_commit: false, sort: 'date', order: 'asc', limit: 20, page: 1, query }
  })

  const { branch_count, default_branch_commit_count, pull_req_summary, tag_count } = repoSummary || {}

  const { data: { body: readmeContent } = {} } = useGetContentQuery({
    path: 'README.md',
    repo_ref: repoRef,
    queryParams: { include_commit: false, git_ref: normalizeGitRef(selectedBranch.name) }
  })

  const decodedReadmeContent = useMemo(() => {
    return decodeGitContent(readmeContent?.content?.data)
  }, [readmeContent])

  const { data: { body: repoDetails } = {} } = useGetContentQuery({
    path: '',
    repo_ref: repoRef,
    queryParams: { include_commit: true, git_ref: normalizeGitRef(selectedBranch.name) }
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

  const buildFilePath = useCallback(
    (itemPath: string | undefined) =>
      `/spaces/${spaceId}/repos/${repoId}/code/${gitRef || selectedBranch}/~/${itemPath}`,
    [spaceId, repoId, gitRef, selectedBranch]
  )

  useEffect(() => {
    setLoading(true)

    if (!repoEntryPathToFileTypeMap.size) {
      return
    }

    pathDetails({
      queryParams: { git_ref: normalizeGitRef(selectedBranch.name) },
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
              path: buildFilePath(item?.path)
            }))
          )
        }
      })
      .catch()
      .finally(() => {
        setLoading(false)
      })
  }, [repoEntryPathToFileTypeMap, selectedBranch, repoRef, buildFilePath])

  useEffect(() => {
    if (!branchList.length) {
      return
    }

    const defaultBranch = branchList.find(branch => branch.default)

    setSelectedBranch({
      name: defaultBranch?.name || '',
      sha: defaultBranch?.sha || '',
      default: true
    })
  }, [branchList])

  const { data: filesData } = useListPathsQuery({
    repo_ref: repoRef,
    queryParams: { git_ref: normalizeGitRef(gitRef || selectedBranch.name) }
  })

  const filesList = filesData?.body?.files || []

  const navigateToFile = useCallback(
    (filePath: string) => {
      navigate(`${spaceId}/repos/${repoId}/code/${gitRef || selectedBranch}/~/${filePath}`)
    },
    [gitRef, selectedBranch, navigate, repoId, spaceId]
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

  return (
    <>
      <RepoSummaryView
        loading={loading}
        selectedBranch={selectedBranch}
        branchList={branchList}
        tagList={[]}
        selectBranch={setSelectedBranch}
        filesList={filesList}
        navigateToFile={navigateToFile}
        repository={repository}
        handleCreateToken={handleCreateToken}
        repoEntryPathToFileTypeMap={repoEntryPathToFileTypeMap}
        files={files}
        decodedReadmeContent={decodedReadmeContent}
        summaryDetails={summaryDetails}
        spaceId={spaceId || ''}
        repoId={repoId || ''}
        gitRef={gitRef}
        latestCommitInfo={latestCommitInfo}
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
