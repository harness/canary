import { FC, useRef } from 'react'

import { Button, DropdownMenu, Icon, Link } from '@/components'
import { useTranslation } from '@/context'

export interface FileAdditionsTriggerProps {
  pathNewFile: string
  pathUploadFiles: string
}

export const FileAdditionsTrigger: FC<FileAdditionsTriggerProps> = ({ pathNewFile, pathUploadFiles }) => {
  const triggerRef = useRef<HTMLButtonElement>(null)
  const { t } = useTranslation()

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild ref={triggerRef}>
        <Button className="relative overflow-hidden pl-4 pr-8" variant="outline">
          <span className="border-r pr-2.5">{t('views:repos.create-new-file-no-plus', 'Create new file')}</span>
          <span className="absolute right-0 top-0 flex h-full w-8 items-center justify-center text-icons-7 transition-colors group-data-[state=open]:bg-cn-background-3 group-data-[state=open]:text-icons-9">
            <Icon name="chevron-down" size={12} />
          </span>
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content className="min-w-[157px]" align="end">
        <DropdownMenu.Item>
          <Link variant="secondary" to={pathNewFile} prefixIcon="plus">
            <span className="truncate">{t('views:repos.create-new-file-no-plus', 'Create new file')}</span>
          </Link>
        </DropdownMenu.Item>
        <DropdownMenu.Item>
          <Link variant="secondary" to={pathUploadFiles} prefixIcon="upload">
            <span className="truncate">{t('views:repos.upload-files', 'Upload files')}</span>
          </Link>
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}
