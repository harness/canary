import { FC, useMemo } from 'react'

import { BranchSelectorTab, CodeModes, RepoFiles } from '@harnessio/ui/views'

import { RepoFileContentViewer } from './repo-file-content-viewer'
import { RepoFileEdit } from './repo-file-edit'
import { repoFilesStore } from './repo-files-store'

interface RepoFilesWrapperProps {
  codeMode: CodeModes
  isDir: boolean
  isMarkdown?: boolean
}

export const RepoFilesWrapper: FC<RepoFilesWrapperProps> = ({ codeMode, isDir, isMarkdown = false }) => {
  const selectedBranchTag = { name: 'main', sha: '1d0e5a9461b340ebb3d7e092a2d35ff6d0d5c952', default: true }
  const selectedRefType = 'branches' as BranchSelectorTab
  const spaceId = 'canary'
  const repoId = 'canary'
  const gitRef = 'refs/heads/main'

  /**
   * Render File content view or Edit file view
   */
  const renderCodeView = useMemo(() => {
    if (codeMode === CodeModes.VIEW && !isDir) {
      return <RepoFileContentViewer isMarkdown={isMarkdown} />
    }

    if (codeMode !== CodeModes.VIEW) {
      return <RepoFileEdit />
    }

    return <></>
  }, [codeMode, isDir, isMarkdown])

  return (
    <RepoFiles
      isRepoEmpty={repoFilesStore.repository.is_empty}
      pathParts={repoFilesStore.pathParts}
      files={repoFilesStore.files}
      isDir={isDir}
      isShowSummary={true}
      latestFile={repoFilesStore.latestCommitInfo}
      pathNewFile=""
      pathUploadFiles=""
      codeMode={codeMode}
      selectedBranchTag={selectedBranchTag}
      repoId={repoId}
      spaceId={spaceId}
      gitRef={gitRef}
      selectedRefType={selectedRefType}
      defaultBranchName={repoFilesStore.repository.default_branch}
      currentBranchDivergence={{ behind: 0, ahead: 0 }}
      isLoadingRepoDetails={false}
    >
      {renderCodeView}
    </RepoFiles>
  )
}
