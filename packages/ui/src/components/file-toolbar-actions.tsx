import { FC } from 'react'

import { Button, ButtonGroup, CopyButton, Icon } from '@/components'
import { cn } from '@utils/cn'

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
      <CopyButton
        className={cn('border-borders-1 hover:bg-background-4', showEdit ? 'rounded-l border-r' : 'rounded-l')}
        name={copyContent}
      />
      {showEdit && (
        <Button
          className="border-borders-1 hover:bg-background-4 border-r"
          size="icon"
          variant="custom"
          aria-label="Edit"
          onClick={onEditClick}
        >
          <Icon name="edit-pen" size={16} className="text-icons-3" />
        </Button>
      )}
      <Button
        className={cn('border-borders-1 hover:bg-background-4', showEdit ? 'rounded-r' : 'border-l rounded-r')}
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
