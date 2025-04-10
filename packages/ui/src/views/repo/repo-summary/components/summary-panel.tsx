import { FC } from 'react'

import { Badge, Button, DropdownMenu, Icon, IconProps, Spacer, Text } from '@/components'
import { TranslationStore } from '@views/repo/repo-list/types'

import { EditRepoDetails } from './edit-repo-details-dialog'

interface DetailItem {
  id: string
  iconName: 'tube-sign' | 'open-pr' | 'tag' | 'branch' | IconProps['name']
  name: string
  count: number
}

interface SummaryPanelProps {
  title: string
  details: DetailItem[]
  timestamp?: string
  description?: string
  is_public?: boolean
  saveDescription: (description: string) => void
  updateRepoError?: string
  isEditDialogOpen: boolean
  setEditDialogOpen: (value: boolean) => void
  useTranslationStore: () => TranslationStore
}

const SummaryPanel: FC<SummaryPanelProps> = ({
  title,
  details,
  timestamp,
  description = '',
  is_public,
  saveDescription,
  updateRepoError,
  isEditDialogOpen,
  setEditDialogOpen,
  useTranslationStore
}) => {
  const { t } = useTranslationStore()
  const onClose = () => {
    setEditDialogOpen(false)
  }
  const onSave = (description: string) => {
    saveDescription(description)
  }
  return (
    <>
      <div className="flex flex-col items-start">
        <div className="flex w-full items-center justify-between">
          <span className="truncate text-18 font-medium">{title}</span>
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <Button variant="ghost" size="sm_icon" aria-label="More options">
                <Icon name="more-dots-fill" size={12} className="text-icons-3" />
              </Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content align="end">
              <DropdownMenu.Item className="flex items-center gap-1.5" onClick={() => setEditDialogOpen(true)}>
                <span>{description?.length ? 'Edit Description' : 'Add description'}</span>
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        </div>
        {!!timestamp?.length && (
          <>
            <Spacer size={2} />
            <span className="text-13 text-cn-foreground-2">Created {timestamp}</span>
          </>
        )}
        <Spacer size={3} />
        {/* TODO: Design system: Replace with Tag */}
        <Badge variant="surface" theme={!is_public ? 'muted' : 'success'}>
          {!is_public ? t('views:repos.private', 'Private') : t('views:repos.public', 'Public')}
        </Badge>
        {!!description?.length && (
          <>
            <Spacer size={3} />
            <span className="border-cn-borders-4 line-clamp-6 w-full border-y py-1 text-14 text-cn-foreground-2">
              {description}
            </span>
          </>
        )}
        <Spacer size={5} />

        <div className="flex flex-col gap-3">
          {details &&
            details.map(item => (
              <div key={item.id} className="flex items-center gap-1.5">
                <Icon name={item.iconName} size={14} className="fill-none text-cn-foreground-3" />
                <Text>{item.name}</Text>
                <Badge variant="counter" size="sm">
                  {item.count}
                </Badge>
              </div>
            ))}
        </div>
      </div>
      <EditRepoDetails
        showEditRepoDetails={isEditDialogOpen}
        description={description}
        onSave={onSave}
        onClose={onClose}
        updateRepoError={updateRepoError}
      />
    </>
  )
}

export default SummaryPanel
