import { FC } from 'react'

import { Button, CopyButton, IconV2, Layout } from '@/components'
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
    <Layout.Horizontal>
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
          <IconV2 name="edit-pencil" className="text-icons-3" />
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
        <IconV2 name="download" className="text-icons-3" />
      </Button>
    </Layout.Horizontal>
  )
}
