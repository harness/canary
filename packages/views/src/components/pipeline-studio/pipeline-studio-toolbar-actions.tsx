import { Icon, ToggleGroup, ToggleGroupItem } from '@harnessio/canary'

import { CopyButton } from '../copy-button'

export interface PipelineStudioToolbarActionsProps {
  onCopyClick: () => void
  onDownloadClick: () => void
  onEditClick: () => void
  copyContent: string
  showEdit?: boolean
}

export const PipelineStudioToolbarActions = (props: PipelineStudioToolbarActionsProps): JSX.Element => {
  const { onCopyClick, onDownloadClick, onEditClick, copyContent, showEdit } = props

  return (
    // TODO: we use "value=''" to make toggle group controlled and prevent button selection
    <ToggleGroup type="single" variant="compact" value="">
      <ToggleGroupItem value="copy" onClick={onCopyClick} title="Copy">
        <CopyButton name={copyContent} />
      </ToggleGroupItem>
      {showEdit && (
        <ToggleGroupItem value="edit" onClick={onEditClick} title="Edit">
          <Icon name="edit-pen" className="text-foreground h-5 w-5" />
        </ToggleGroupItem>
      )}
      <ToggleGroupItem value="download" onClick={onDownloadClick} title="Download">
        <Icon name="download" className="text-foreground h-5 w-5" />
      </ToggleGroupItem>
    </ToggleGroup>
  )
}
