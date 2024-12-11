import { ReactNode, useMemo } from 'react'

import { NoData, PathParts, SkeletonList } from '@/components'
import {
  CodeModes,
  FileLastChangeBar,
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
}

export const RepoFiles = ({
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
  codeMode
}: RepoFilesProps) => {
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
      return <Summary latestFile={latestFile} files={files} useTranslationStore={useTranslationStore} />

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
  }, [isDir, children, loading, isShowSummary, latestFile, files, useTranslationStore, isView])

  return (
    <SandboxLayout.Main leftSubPanelWidth={248} fullWidth hasLeftPanel hasLeftSubPanel hasHeader hasSubHeader>
      <SandboxLayout.Content className="relative z-0">
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
