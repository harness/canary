import { FC } from 'react'

import { Button, ButtonGroup, CopyButton, Icon } from '@/components'

const buttonClassName = 'rounded-none border-l border-borders-1 hover:bg-background-4'

export interface FileToolbarActionsProps {
  onDownloadClick: () => void
  onEditClick: () => void
  copyContent: string
  showEdit?: boolean
}

export const FileToolbarActions: FC<FileToolbarActionsProps> = ({
  onDownloadClick,
  onEditClick,
  copyContent,
  showEdit = false
}) => {
  return (
    <ButtonGroup spacing="0" className="shadow-borders-1 h-full rounded shadow-as-border">
      <CopyButton className={`${buttonClassName} rounded-l`} name={copyContent} />
      {showEdit && (
        <Button className={buttonClassName} size="icon" variant="custom" aria-label="Edit" onClick={onEditClick}>
          <Icon name="edit-pen" size={16} className="text-icons-3" />
        </Button>
      )}
      <Button
        className={`${buttonClassName} rounded-r`}
        size="icon"
        variant="custom"
        aria-label="Download"
        onClick={onDownloadClick}
      >
        <Icon name="download" size={16} className="text-icons-3" />
      </Button>
    </ButtonGroup>
  )
}
