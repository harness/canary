import { Button, FileAdditionsTrigger, PathBreadcrumbs, PathParts } from '@/components'
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

export const PathActionBar = ({
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
}: PathActionBarProps) => {
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
        <FileAdditionsTrigger
          useTranslationStore={useTranslationStore}
          pathNewFile={pathNewFile}
          pathUploadFiles={pathUploadFiles}
        />
      )}
      {codeMode !== CodeModes.VIEW && (
        <div className="flex gap-3">
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
