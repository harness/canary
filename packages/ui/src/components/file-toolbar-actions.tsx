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
  const commonButtonClasses = 'border-cn-borders-2 hover:bg-cds-background-4'
  return (
    <ButtonGroup spacing="0" className="h-full rounded">
      <CopyButton className={cn(commonButtonClasses, 'border rounded-r-none')} name={copyContent} />
      {showEdit && (
        <Button
          className={cn(commonButtonClasses, 'border-y rounded-none')}
          size="icon"
          variant="custom"
          aria-label="Edit"
          onClick={onEditClick}
        >
          <Icon name="edit-pen" size={16} className="text-icons-3" />
        </Button>
      )}
      <Button
        className={cn(commonButtonClasses, 'rounded-l-none', showEdit ? 'border' : 'border-l-0 border-y border-r')}
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
