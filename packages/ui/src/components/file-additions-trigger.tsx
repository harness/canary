import { FC, useRef } from 'react'

import { Button, DropdownMenu, IconV2, Link } from '@/components'
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
          <span className="border-r pr-2.5">{t('views:repos.create-file', 'Create file')}</span>
          <span className="absolute right-0 top-0 flex h-full w-8 items-center justify-center text-icons-7 transition-colors group-data-[state=open]:bg-cn-background-3 group-data-[state=open]:text-icons-9">
            <IconV2 name="nav-arrow-down" size="2xs" />
          </span>
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align="end">
        <DropdownMenu.Item
          title={
            <Link variant="secondary" to={pathNewFile} prefixIcon="check">
              <span className="truncate">{t('views:repos.create-file', 'Create file')}</span>
            </Link>
          }
        />
        <DropdownMenu.Item
          title={
            <Link variant="secondary" to={pathUploadFiles} prefixIcon="upload">
              <span className="truncate">{t('views:repos.upload-files', 'Upload files')}</span>
            </Link>
          }
        />
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}
