import { FC, useCallback, useMemo } from 'react'

import { BranchSelectorTab, CodeModes, IBranchSelectorStore, RepoFiles } from '@harnessio/ui/views'

import { noop, useTranslationsStore } from '../../../utils.ts'
import { RepoFileContentViewer } from './repo-file-content-viewer.tsx'
import { RepoFileEdit } from './repo-file-edit.tsx'
import { repoFilesStore } from './repo-files-store.ts'

interface RepoFilesWrapperProps {
  codeMode: CodeModes
  isDir: boolean
  isMarkdown?: boolean
}

export const RepoFilesWrapper: FC<RepoFilesWrapperProps> = ({ codeMode, isDir, isMarkdown = false }) => {
  const useRepoBranchesStore = useCallback(
    (): IBranchSelectorStore => ({
      ...repoFilesStore.branchSelectorStore,
      selectedBranchType: BranchSelectorTab.BRANCHES,
      setSelectedBranchTag: noop,
      setSelectedBranchType: noop,
      xNextPage: 0,
      xPrevPage: 0,
      page: 1,
      setPage: noop,
      defaultBranch: '',
      branchDivergence: [],
      branchList: []
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
    >
      {renderCodeView}
    </RepoFiles>
  )
}
