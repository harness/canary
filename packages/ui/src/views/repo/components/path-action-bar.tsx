import { FC } from 'react'

import { Button, Dialog, IconV2, Layout, PathBreadcrumbs, PathParts } from '@/components'
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
    <Layout.Horizontal align="start" justify="between">
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
            <Link to={pathNewFile}>
              <IconV2 name="plus" />
              {t('views:repos.createFile', 'Create File')}
            </Link>
          </Button>
        )}
      {codeMode !== CodeModes.VIEW && (
        <Layout.Flex gapX="sm">
          {!!handleCancelFileEdit && (
            <Button variant="outline" onClick={handleCancelFileEdit}>
              Cancel Changes
            </Button>
          )}
          {!!handleOpenCommitDialog && (
            <Dialog.Trigger>
              <Button onClick={handleOpenCommitDialog}>
                <IconV2 name="upload" />
                Commit Changes
              </Button>
            </Dialog.Trigger>
          )}
        </Layout.Flex>
      )}
    </Layout.Horizontal>
  )
}
PathActionBar.displayName = 'PathActionBar'
