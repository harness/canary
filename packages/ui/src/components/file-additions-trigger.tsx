import { FC, useRef } from 'react'
import { Link } from 'react-router-dom'

import { Button, DropdownMenu, Icon } from '@/components'
import { TranslationStore } from '@/views'

export interface FileAdditionsTriggerProps {
  useTranslationStore: () => TranslationStore
  pathNewFile: string
  pathUploadFiles: string
}

export const FileAdditionsTrigger: FC<FileAdditionsTriggerProps> = ({
  useTranslationStore,
  pathNewFile,
  pathUploadFiles
}) => {
  const triggerRef = useRef<HTMLButtonElement>(null)
  const { t } = useTranslationStore()

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild ref={triggerRef}>
        <Button className="relative overflow-hidden pl-4 pr-8" variant="outline">
          <span className="border-r pr-2.5">{t('views:repos.create-new-file-no-plus', 'Create new file')}</span>
          <span className="absolute right-0 top-0 flex h-full w-8 items-center justify-center text-icons-7 transition-colors group-data-[state=open]:bg-background-3 group-data-[state=open]:text-icons-9">
            <Icon name="chevron-down" size={12} />
          </span>
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content className="min-w-[157px]" align="end">
        <DropdownMenu.Item>
          <Link className="relative grid grid-cols-[auto_1fr] items-center gap-2.5" to={pathNewFile}>
            <Icon name="plus" size={12} />
            <span className="truncate">{t('views:repos.create-new-file-no-plus', 'Create new file')}</span>
          </Link>
        </DropdownMenu.Item>
        <DropdownMenu.Item>
          <Link className="relative grid grid-cols-[auto_1fr] items-center gap-2.5" to={pathUploadFiles}>
            <Icon name="upload" size={12} />
            <span className="truncate">{t('views:repos.upload-files', 'Upload files')}</span>
          </Link>
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}
