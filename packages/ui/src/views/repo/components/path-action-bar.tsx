import { FC } from 'react'

import { Button, Layout, PathBreadcrumbs, PathParts } from '@/components'
import { useRouterContext, useTranslation } from '@/context'
import { BranchSelectorTab, CodeModes } from '@/views'

export interface PathActionBarProps {
  codeMode: CodeModes
  pathParts: PathParts[]
  changeFileName?: (value: string) => void
  onBlurFileName?: () => void
  gitRefName?: string
  fileName?: string
  pathNewFile?: string
  pathUploadFiles?: string
  handleOpenCommitDialog?: () => void
  handleCancelFileEdit?: () => void
  parentPath?: string
  setParentPath?: (value: string) => void
  selectedRefType: BranchSelectorTab
  fullResourcePath?: string
}

export const PathActionBar: FC<PathActionBarProps> = ({
  codeMode,
  pathParts,
  changeFileName,
  onBlurFileName,
  gitRefName,
  fileName,
  pathNewFile,
  pathUploadFiles,
  handleOpenCommitDialog,
  handleCancelFileEdit,
  parentPath,
  setParentPath,
  selectedRefType,
  fullResourcePath
}) => {
  const { Link } = useRouterContext()
  const { t } = useTranslation()

  return (
    <Layout.Horizontal className="items-center justify-between">
      <PathBreadcrumbs
        isEdit={codeMode === CodeModes.EDIT}
        isNew={codeMode === CodeModes.NEW}
        items={pathParts}
        changeFileName={changeFileName}
        handleOnBlur={onBlurFileName}
        gitRefName={gitRefName}
        fileName={fileName}
        parentPath={parentPath}
        setParentPath={setParentPath}
        fullResourcePath={fullResourcePath}
      />
      {codeMode === CodeModes.VIEW &&
        pathNewFile &&
        pathUploadFiles &&
        selectedRefType === BranchSelectorTab.BRANCHES && (
          <Button asChild>
            <Link className="relative grid grid-cols-[auto_1fr] items-center gap-1.5" to={pathNewFile}>
              <span className="truncate">{t('views:repos.create-file', 'Create file')}</span>
            </Link>
          </Button>
        )}
      {codeMode !== CodeModes.VIEW && (
        <div className="flex gap-2.5">
          {!!handleCancelFileEdit && (
            <Button variant="outline" onClick={handleCancelFileEdit}>
              Cancel changes
            </Button>
          )}
          {!!handleOpenCommitDialog && <Button onClick={handleOpenCommitDialog}>Commit changes</Button>}
        </div>
      )}
    </Layout.Horizontal>
  )
}
PathActionBar.displayName = 'PathActionBar'
