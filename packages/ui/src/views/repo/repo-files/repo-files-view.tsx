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

  const isEmptyRepository = useMemo(() => {
    return isRepoEmpty === true || repoDetailsError?.message?.includes("path './' wasn't found")
  }, [isRepoEmpty, repoDetailsError])

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

    // Show NoData for empty repositories
    // Prioritize root path error as strong indicator of empty repo (even if files array has stale data)
    if (isEmptyRepository) {
      return (
        <NoData
          withBorder
          imageName="no-data-folder"
          title={t('views:repos.noFiles.title', 'No files yet')}
          description={[
            t('views:repos.noFiles.description', 'This repository is empty. Add your first file to get started.')
          ]}
          primaryButton={{
            label: (
              <>
                <IconV2 name="plus" />
                {t('views:repos.createFile', 'Create File')}
              </>
            ),
            to: `${spaceId ? `/${spaceId}` : ''}/repos/${repoId}/files/new/${gitRef}/~/`
          }}
          className="py-cn-2 gap-cn-1"
        />
      )
    }

    // Show 404 for invalid file paths when repository has files
    if (repoDetailsError) {
      return <NotFoundPage errorMessage={repoDetailsError.message} />
    }

    return null
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
    repoDetailsError,
    t,
    toCommitDetails,
    spaceId,
    repoId,
    gitRef,
    isEmptyRepository
  ])

  return (
    <SandboxLayout.Main className="repo-files-height bg-transparent min-w-0">
      <SandboxLayout.Content className="pl-cn-sm gap-y-cn-md flex h-full flex-col">
        {isView && !isEmptyRepository && (
          <div className="-mt-cn-3xs">
            <PathActionBar
              codeMode={codeMode}
              pathParts={pathParts}
              pathNewFile={pathNewFile}
              pathUploadFiles={pathUploadFiles}
              selectedRefType={selectedRefType}
              fullResourcePath={fullResourcePath}
            />
          </div>
        )}
        {content}
      </SandboxLayout.Content>
    </SandboxLayout.Main>
  )
}

RepoFiles.displayName = 'RepoFiles'
