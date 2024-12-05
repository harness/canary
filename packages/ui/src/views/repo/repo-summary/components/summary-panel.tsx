import { FC } from 'react'

import {
  Badge,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Icon,
  IconProps,
  Spacer,
  Text
} from '@/components'

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
  saveDescription: (description: string) => void
  updateRepoError?: string
  isEditDialogOpen: boolean
  setEditDialogOpen: (value: boolean) => void
}

const SummaryPanel: FC<SummaryPanelProps> = ({
  title,
  details,
  timestamp,
  description = '',
  saveDescription,
  updateRepoError,
  isEditDialogOpen,
  setEditDialogOpen
}) => {
  const onClose = () => {
    setEditDialogOpen(false)
  }
  const onSave = (description: string) => {
    saveDescription(description)
  }
  return (
    <>
      <div className="flex flex-col">
        <div className="flex items-center justify-between">
          <span className="truncate text-18 font-medium">{title}</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm_icon" aria-label="More options">
                <Icon name="more-dots-fill" size={12} className="text-icons-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="flex items-center gap-1.5" onClick={() => setEditDialogOpen(true)}>
                <Icon name="plus" size={12} className="text-tertiary-background" />
                <span>{description?.length ? 'Edit Description' : 'Add description'}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {!!timestamp?.length && (
          <>
            <Spacer size={2} />
            <span className="text-13 text-foreground-4">Created {timestamp}</span>
          </>
        )}
        {!!description?.length && (
          <>
            <Spacer size={3} />
            <span className="border-y border-borders-4 py-1 text-14 text-foreground-2 line-clamp-6">{description}</span>
          </>
        )}
        <Spacer size={5} />
        <div className="flex flex-col gap-3">
          {details &&
            details.map(item => (
              <div key={item.id} className="flex items-center gap-1.5">
                <Icon name={item.iconName} size={14} className="text-tertiary-background" />
                <Text>{item.name}</Text>
                <Badge variant="outline" size="sm">
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
