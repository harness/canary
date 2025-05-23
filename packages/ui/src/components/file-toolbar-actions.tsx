import { FC } from 'react'

import { Button, CopyButton, Icon, Layout } from '@/components'
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
    <Layout.Horizontal gap="gap-0">
      <CopyButton className="rounded-r-none" name={copyContent} />
      {showEdit && (
        <Button
          className={cn('border-y rounded-none')}
          size="sm"
          variant="outline"
          iconOnly
          aria-label="Edit"
          onClick={onEditClick}
        >
          <Icon name="edit-pen" size={16} className="text-icons-3" />
        </Button>
      )}
      <Button
        className={cn('rounded-l-none', showEdit ? 'border' : 'border-l-0 border-y border-r')}
        size="sm"
        iconOnly
        variant="outline"
        aria-label="Download"
        onClick={onDownloadClick}
      >
        <Icon name="download" size={16} className="text-icons-3" />
      </Button>
    </Layout.Horizontal>
  )
}
