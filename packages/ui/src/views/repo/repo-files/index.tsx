import { FC, ReactNode, useMemo } from 'react'

import { NoData, PathParts, SkeletonList } from '@/components'
import { useTranslation } from '@/context'
import {
  BranchInfoBar,
  BranchSelectorListItem,
  BranchSelectorTab,
  CodeModes,
  CommitDivergenceType,
  FileLastChangeBar,
  LatestFileTypes,
  PathActionBar,
  RepoFile,
  SandboxLayout,
  Summary
} from '@/views'

interface RepoFilesProps {
  pathParts: PathParts[]
  loading: boolean
  files: RepoFile[]
  isDir: boolean
  isRepoEmpty?: boolean
  isShowSummary: boolean
  latestFile: LatestFileTypes
  children: ReactNode
  pathNewFile: string
  pathUploadFiles: string
  codeMode: CodeModes
  defaultBranchName?: string
  currentBranchDivergence: CommitDivergenceType
  toCommitDetails?: ({ sha }: { sha: string }) => string
  isLoadingRepoDetails: boolean
  toRepoFileDetails?: ({ path }: { path: string }) => string
  selectedBranchTag: BranchSelectorListItem | null
  repoId: string
  spaceId?: string
  gitRef: string
  selectedRefType: BranchSelectorTab
  fullResourcePath?: string
}

export const RepoFiles: FC<RepoFilesProps> = ({
  pathParts,
  loading,
  files,
  isDir,
  isShowSummary,
  latestFile,
  children,
  pathNewFile,
  pathUploadFiles,
  codeMode,
  defaultBranchName,
  currentBranchDivergence,
  isRepoEmpty,
  toCommitDetails,
  isLoadingRepoDetails,
  toRepoFileDetails,
  selectedBranchTag,
  repoId,
  spaceId,
  gitRef,
  selectedRefType,
  fullResourcePath
}) => {
  const { t } = useTranslation()

  const isView = useMemo(() => codeMode === CodeModes.VIEW, [codeMode])

  const content = useMemo(() => {
    if (loading || isLoadingRepoDetails) return <SkeletonList />

    if (!isView) return children

    if (!isRepoEmpty && !isDir) {
      return (
        <>
          {!isLoadingRepoDetails && <FileLastChangeBar toCommitDetails={toCommitDetails} {...latestFile} />}
          {children}
        </>
      )
    }

    if (isShowSummary && files.length)
      return (
        <>
          {selectedBranchTag?.name !== defaultBranchName && (
            <BranchInfoBar
              repoId={repoId}
              spaceId={spaceId}
              defaultBranchName={defaultBranchName}
              selectedBranchTag={selectedBranchTag || { name: '', sha: '' }}
              currentBranchDivergence={{
                ahead: currentBranchDivergence.ahead || 0,
                behind: currentBranchDivergence.behind || 0
              }}
              refType={selectedRefType}
            />
          )}
          <Summary
            toCommitDetails={toCommitDetails}
            latestFile={latestFile}
            files={files}
            toRepoFileDetails={toRepoFileDetails}
          />
        </>
      )

    return (
      <NoData
        withBorder
        imageName="no-data-folder"
        title="No files yet"
        description={['There are no files in this repository yet.']}
        primaryButton={{
          label: 'Create file',
          to: `${spaceId ? `/${spaceId}` : ''}/repos/${repoId}/files/new/${gitRef}/~/`
        }}
      />
    )
  }, [
    isView,
    children,
    isDir,
    latestFile,
    loading,
    isShowSummary,
    files,
    selectedBranchTag?.name,
    defaultBranchName,
    currentBranchDivergence.ahead,
    currentBranchDivergence.behind,
    isLoadingRepoDetails,
    isRepoEmpty,
    t,
    toCommitDetails
  ])

  return (
    <SandboxLayout.Main className="bg-transparent" fullWidth>
      <SandboxLayout.Content className="flex h-full flex-col pl-cn-xl gap-y-cn-md">
        {isView && !isRepoEmpty && (
          <PathActionBar
            codeMode={codeMode}
            pathParts={pathParts}
            pathNewFile={pathNewFile}
            pathUploadFiles={pathUploadFiles}
            selectedRefType={selectedRefType}
            fullResourcePath={fullResourcePath}
          />
        )}
        {content}
      </SandboxLayout.Content>
    </SandboxLayout.Main>
  )
}

RepoFiles.displayName = 'RepoFiles'
