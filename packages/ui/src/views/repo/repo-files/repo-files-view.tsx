import { FC, ReactNode, useMemo } from 'react'

import { IconV2, NoData, PathParts } from '@/components'
import { useTranslation } from '@/context'
import { UsererrorError } from '@/types'
import {
  BranchInfoBar,
  BranchSelectorListItem,
  BranchSelectorTab,
  CodeModes,
  CommitDivergenceType,
  FileLastChangeBar,
  LatestFileTypes,
  NotFoundPage,
  PathActionBar,
  RepoFile,
  SandboxLayout,
  Summary
} from '@/views'

interface RepoFilesProps {
  pathParts: PathParts[]
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
  showContributeBtn?: boolean
  repoDetailsError?: UsererrorError | null
  scheduleFileMetaFetch?: (paths: string[]) => void
}

export const RepoFiles: FC<RepoFilesProps> = ({
  pathParts,
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
  fullResourcePath,
  showContributeBtn,
  repoDetailsError,
  scheduleFileMetaFetch
}) => {
  const { t } = useTranslation()

  const isView = useMemo(() => codeMode === CodeModes.VIEW, [codeMode])

  const content = useMemo(() => {
    if (!isView) return children

    if (!isRepoEmpty && !isDir && !repoDetailsError) {
      return (
        <>
          {!isLoadingRepoDetails && <FileLastChangeBar toCommitDetails={toCommitDetails} {...latestFile} />}
          {children}
        </>
      )
    }

    if (isShowSummary && files.length && !repoDetailsError)
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
              showContributeBtn={showContributeBtn}
            />
          )}
          <Summary
            toCommitDetails={toCommitDetails}
            latestFile={latestFile}
            files={files}
            toRepoFileDetails={toRepoFileDetails}
            scheduleFileMetaFetch={scheduleFileMetaFetch}
          />
        </>
      )

    if (repoDetailsError) {
      return <NotFoundPage errorMessage={repoDetailsError.message} />
    }

    return (
      <NoData
        withBorder
        imageName="no-data-folder"
        title="No files yet"
        description={['There are no files in this repository yet.']}
        primaryButton={{
          label: (
            <>
              <IconV2 name="plus" />
              {t('views:repos.createFile', 'Create File')}
            </>
          ),
          to: `${spaceId ? `/${spaceId}` : ''}/repos/${repoId}/files/new/${gitRef}/~/`
        }}
      />
    )
  }, [
    isView,
    children,
    isDir,
    latestFile,
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
    <SandboxLayout.Main className="repo-files-height pt-cn-xl bg-transparent">
      <SandboxLayout.Content className="pl-cn-lg gap-y-cn-md flex h-full flex-col">
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
