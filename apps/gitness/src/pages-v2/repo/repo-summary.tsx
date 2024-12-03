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
  useListTagsQuery,
  useSummaryQuery,
  useUpdateRepositoryMutation
} from '@harnessio/code-service-client'
import { BranchSelectorListItem, BranchSelectorTab, RepoFile, RepoSummaryView } from '@harnessio/ui/views'
import { generateAlphaNumericHash, SummaryItemType, useCommonFilter } from '@harnessio/views'

import { useGetRepoRef } from '../../framework/hooks/useGetRepoPath'
import { useTranslationStore } from '../../i18n/stores/i18n-store'
import { timeAgoFromISOTime } from '../../pages/pipeline-edit/utils/time-utils'
import { TokenFormType } from '../../pages/profile-settings/token-create/token-create-form'
import { TokenSuccessDialog } from '../../pages/profile-settings/token-create/token-success-dialog'
import { PathParams } from '../../RouteDefinitions'
import { decodeGitContent, getTrimmedSha, normalizeGitRef, REFS_TAGS_PREFIX } from '../../utils/git-utils'

export default function RepoSummaryPage() {
  const [loading, setLoading] = useState(false)
  const [files, setFiles] = useState<RepoFile[]>([])
  const repoRef = useGetRepoRef()
  const navigate = useNavigate()
  const { spaceId, repoId } = useParams<PathParams>()
  const [gitRef, setGitRef] = useState<string>('')

  const { data: { body: repository } = {}, refetch: refetchRepo } = useFindRepositoryQuery({ repo_ref: repoRef })

  const { data: { body: branches } = {} } = useListBranchesQuery({
    repo_ref: repoRef,
    queryParams: { include_commit: false, sort: 'date', order: 'asc', limit: 20, page: 1, query: '' }
  })

  const [selectedBranchTag, setSelectedBranchTag] = useState<BranchSelectorListItem>({
    name: '',
    sha: ''
  })

  const { mutate: updateDescription } = useUpdateRepositoryMutation(
    { repo_ref: repoRef },
    {
      onSuccess: () => {
        refetchRepo()
      }
    }
  )
  const [isEditingDescription, setIsEditingDescription] = useState<boolean>(false)

  const onChangeDescription = () => {
    setIsEditingDescription(true)
  }

  const saveDescription = (description: string) => {
    updateDescription({
      body: {
        description: description
      }
    })
    setIsEditingDescription(false)
  }

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

  const { data: tags } = useListTagsQuery({
    repo_ref: repoRef,
    queryParams: {
      include_commit: false,
      sort: 'date',
      order: 'asc',
      limit: 20,
      page: 1,
      query: ''
    }
  })

  const tagsList: BranchSelectorListItem[] = useMemo(() => {
    if (!tags?.body) return []

    return tags.body.map(item => ({
      name: item?.name || '',
      sha: item?.sha || '',
      default: false
    }))
  }, [tags])

  const selectBranchorTag = useCallback(
    (branchTagName: BranchSelectorListItem, type: BranchSelectorTab) => {
      if (type === BranchSelectorTab.BRANCHES) {
        const branch = branchList.find(branch => branch.name === branchTagName.name)
        if (branch) {
          setSelectedBranchTag(branch)
          setGitRef(branch.name)
        }
      } else if (type === BranchSelectorTab.TAGS) {
        const tag = tagsList.find(tag => tag.name === branchTagName.name)
        if (tag) {
          setSelectedBranchTag(tag)
          setGitRef(`${REFS_TAGS_PREFIX + tag.name}`)
        }
      }
    },
    [navigate, repoId, spaceId, branchList, tagsList]
  )

  const { data: { body: repoSummary } = {} } = useSummaryQuery({
    repo_ref: repoRef,
    queryParams: { include_commit: false, sort: 'date', order: 'asc', limit: 20, page: 1, query }
  })

  const { branch_count, default_branch_commit_count, pull_req_summary, tag_count } = repoSummary || {}

  const { data: { body: readmeContent } = {} } = useGetContentQuery({
    path: 'README.md',
    repo_ref: repoRef,
    queryParams: { include_commit: false, git_ref: normalizeGitRef(gitRef || selectedBranchTag.name) }
  })

  const decodedReadmeContent = useMemo(() => {
    return decodeGitContent(readmeContent?.content?.data)
  }, [readmeContent])

  const { data: { body: repoDetails } = {} } = useGetContentQuery({
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

  const buildFilePath = useCallback(
    (itemPath: string | undefined) => `/${spaceId}/repos/${repoId}/code/${gitRef}/~/${itemPath}`,
    [spaceId, repoId, gitRef, selectedBranchTag]
  )

  useEffect(() => {
    setLoading(true)

    if (!repoEntryPathToFileTypeMap.size) {
      return
    }

    pathDetails({
      queryParams: { git_ref: normalizeGitRef(gitRef || selectedBranchTag.name) },
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
  }, [repoEntryPathToFileTypeMap, selectedBranchTag, repoRef, buildFilePath, gitRef])

  useEffect(() => {
    if (!branchList.length) {
      return
    }

    const defaultBranch = branchList.find(branch => branch.default)

    setSelectedBranchTag({
      name: defaultBranch?.name || '',
      sha: defaultBranch?.sha || '',
      default: true
    })
  }, [branchList])

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

  return (
    <>
      <RepoSummaryView
        loading={loading}
        selectedBranch={selectedBranchTag}
        branchList={branchList}
        tagList={tagsList}
        selectBranch={selectBranchorTag}
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
        onChangeDescription={onChangeDescription}
        isEditingDescription={isEditingDescription}
        setIsEditingDescription={setIsEditingDescription}
        saveDescription={saveDescription}
        useTranslationStore={useTranslationStore}
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
