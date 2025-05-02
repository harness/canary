import { FC } from 'react'

import { Button, Icon, PathBreadcrumbs, PathParts } from '@/components'
import { useRouterContext } from '@/context'
import { CodeModes, TranslationStore } from '@/views'

export interface PathActionBarProps {
  codeMode: CodeModes
  pathParts: PathParts[]
  changeFileName?: (value: string) => void
  onBlurFileName?: () => void
  gitRefName?: string
  fileName?: string
  useTranslationStore: () => TranslationStore
  pathNewFile?: string
  pathUploadFiles?: string
  handleOpenCommitDialog?: () => void
  handleCancelFileEdit?: () => void
}

export const PathActionBar: FC<PathActionBarProps> = ({
  codeMode,
  pathParts,
  changeFileName,
  onBlurFileName,
  gitRefName,
  fileName,
  useTranslationStore,
  pathNewFile,
  pathUploadFiles,
  handleOpenCommitDialog,
  handleCancelFileEdit
}) => {
  const { Link } = useRouterContext()
  const { t } = useTranslationStore()
  return (
    <div className="mb-4 flex h-8 items-center justify-between gap-8">
      <PathBreadcrumbs
        isEdit={codeMode === CodeModes.EDIT}
        isNew={codeMode === CodeModes.NEW}
        items={pathParts}
        changeFileName={changeFileName}
        handleOnBlur={onBlurFileName}
        gitRefName={gitRefName}
        fileName={fileName}
      />
      {codeMode === CodeModes.VIEW && pathNewFile && pathUploadFiles && (
        <Button variant="outline" asChild>
          <Link className="relative grid grid-cols-[auto_1fr] items-center gap-1.5" to={pathNewFile}>
            <Icon name="plus" size={12} />
            <span className="truncate">{t('views:repos.create-new-file-no-plus', 'Create new file')}</span>
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
    </div>
  )
}
