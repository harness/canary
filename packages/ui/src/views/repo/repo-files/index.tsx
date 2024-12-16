import { FC, ReactNode, useMemo } from 'react'

import { NoData, PathParts, SkeletonList, Spacer } from '@/components'
import {
  BranchInfoBar,
  CodeModes,
  FileLastChangeBar,
  IBranchSelectorStore,
  LatestFileTypes,
  PathActionBar,
  RepoFile,
  SandboxLayout,
  Summary,
  TranslationStore
} from '@/views'

interface RepoFilesProps {
  pathParts: PathParts[]
  loading: boolean
  files: RepoFile[]
  isDir: boolean
  isShowSummary: boolean
  latestFile: LatestFileTypes
  children: ReactNode
  useTranslationStore: () => TranslationStore
  pathNewFile: string
  pathUploadFiles: string
  codeMode: CodeModes
  useRepoBranchesStore: () => IBranchSelectorStore
  defaultBranchName?: string
}

export const RepoFiles: FC<RepoFilesProps> = ({
  pathParts,
  loading,
  files,
  isDir,
  isShowSummary,
  latestFile,
  children,
  useTranslationStore,
  pathNewFile,
  pathUploadFiles,
  codeMode,
  useRepoBranchesStore,
  defaultBranchName
}) => {
  const { repoId, spaceId, selectedBranchTag } = useRepoBranchesStore()
  const isView = useMemo(() => codeMode === CodeModes.VIEW, [codeMode])

  const content = useMemo(() => {
    if (!isView) return children

    if (!isDir)
      return (
        <>
          <FileLastChangeBar useTranslationStore={useTranslationStore} {...latestFile} />
          {children}
        </>
      )

    if (loading) return <SkeletonList />

    if (isShowSummary && files.length)
      return (
        <>
          {selectedBranchTag.name !== defaultBranchName && (
            <>
              <Spacer size={4} />
              <BranchInfoBar
                defaultBranchName={defaultBranchName}
                spaceId={spaceId}
                repoId={repoId}
                currentBranchDivergence={{
                  ahead: 10,
                  behind: 20
                }}
              />
            </>
          )}
          <Spacer size={4} />
          <Summary latestFile={latestFile} files={files} useTranslationStore={useTranslationStore} />
        </>
      )

    return (
      <NoData
        insideTabView
        iconName="no-data-folder"
        title="No files yet"
        description={['There are no files in this repository yet.', 'Create new or import an existing file.']}
        primaryButton={{ label: 'Create file' }}
        secondaryButton={{ label: 'Import file' }}
      />
    )
  }, [
    isView,
    children,
    isDir,
    useTranslationStore,
    latestFile,
    loading,
    isShowSummary,
    files,
    selectedBranchTag,
    defaultBranchName,
    spaceId,
    repoId
  ])

  return (
    <SandboxLayout.Main fullWidth>
      <SandboxLayout.Content>
        {isView && (
          <PathActionBar
            codeMode={codeMode}
            pathParts={pathParts}
            useTranslationStore={useTranslationStore}
            pathNewFile={pathNewFile}
            pathUploadFiles={pathUploadFiles}
          />
        )}
        {content}
      </SandboxLayout.Content>
    </SandboxLayout.Main>
  )
}
