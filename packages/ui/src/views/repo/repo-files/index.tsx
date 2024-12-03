import { ReactNode, useMemo } from 'react'

import { NoData, PathBreadcrumbs, PathParts, SkeletonList } from '@/components'
import { LatestFileTypes, RepoFile, SandboxLayout, TranslationStore } from '@/views'
import { Summary } from '@/views/repo/components'

interface RepoFilesProps {
  pathParts: PathParts[]
  loading: boolean
  files: RepoFile[]
  isDir: boolean
  isShowSummary: boolean
  latestFile: LatestFileTypes
  children: ReactNode
  useTranslationStore: () => TranslationStore
}

export const RepoFiles = ({
  pathParts,
  loading,
  files,
  isDir,
  isShowSummary,
  latestFile,
  children,
  useTranslationStore
}: RepoFilesProps) => {
  const content = useMemo(() => {
    if (!isDir) return children

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
  }, [isDir, children, loading, isShowSummary, latestFile, files, useTranslationStore])

  return (
    <SandboxLayout.Main leftSubPanelWidth={248} fullWidth hasLeftPanel hasLeftSubPanel hasHeader hasSubHeader>
      <SandboxLayout.Content>
        <div className="mb-4 flex h-8 items-center">
          <PathBreadcrumbs items={pathParts} />
        </div>
        {content}
      </SandboxLayout.Content>
    </SandboxLayout.Main>
  )
}
