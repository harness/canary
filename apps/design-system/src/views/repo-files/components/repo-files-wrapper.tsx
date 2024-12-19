import { FC, useCallback, useMemo } from 'react'

import { BranchSelectorTab, CodeModes, IBranchSelectorStore, RepoFiles } from '@harnessio/ui/views'

import { noop, useTranslationsStore } from '../../../utils'
import { RepoFileContentViewer } from './repo-file-content-viewer'
import { RepoFileEdit } from './repo-file-edit'
import { repoFilesStore } from './repo-files-store'

interface RepoFilesWrapperProps {
  codeMode: CodeModes
  isDir: boolean
  isMarkdown?: boolean
}

export const RepoFilesWrapper: FC<RepoFilesWrapperProps> = ({ codeMode, isDir, isMarkdown = false }) => {
  const useRepoBranchesStore = useCallback(
    (): IBranchSelectorStore => ({
      ...repoFilesStore.branchSelectorStore,
      selectedRefType: BranchSelectorTab.BRANCHES,
      setSelectedBranchTag: noop,
      setSelectedRefType: noop,
      xNextPage: 0,
      xPrevPage: 0,
      page: 1,
      setPage: noop,
      defaultBranch: '',
      branchList: [],
      setTagList: noop,
      setSpaceIdAndRepoId: noop,
      setBranchList: noop,
      setDefaultBranch: noop,
      setPaginationFromHeaders: noop
    }),
    []
  )

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
      pathParts={repoFilesStore.pathParts}
      loading={false}
      files={repoFilesStore.files}
      isDir={isDir}
      isShowSummary={true}
      latestFile={repoFilesStore.latestCommitInfo}
      useTranslationStore={useTranslationsStore}
      pathNewFile=""
      pathUploadFiles=""
      codeMode={codeMode}
      useRepoBranchesStore={useRepoBranchesStore}
      defaultBranchName={repoFilesStore.repository.default_branch}
      currentBranchDivergence={{ behind: 0, ahead: 0 }}
    >
      {renderCodeView}
    </RepoFiles>
  )
}
