import { FC } from 'react'
import { Link } from 'react-router-dom'

import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Icon
} from '@/components'
import { TranslationStore } from '@/views'

export interface MoreActionsTooltipProps {
  useTranslationStore: () => TranslationStore
  id: number
  openDeleteWebhookDialog: (id: number) => void
}

export const MoreActionsTooltip: FC<MoreActionsTooltipProps> = ({
  useTranslationStore,
  id,
  openDeleteWebhookDialog
}) => {
  const { t } = useTranslationStore()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="text-icons-1 hover:text-icons-2 data-[state=open]:text-icons-2" variant="custom" size="icon">
          <Icon name="vertical-ellipsis" size={14} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-[180px]"
        align="end"
        sideOffset={-6}
        alignOffset={10}
        onCloseAutoFocus={event => event.preventDefault()} // Prevent focus on hidden content
      >
        <DropdownMenuGroup>
          <Link replace to={`${id}`}>
            <DropdownMenuItem>
              <span className="truncate text-sm">{t('views:webhookData.edit', 'Edit webhook')}</span>
            </DropdownMenuItem>
          </Link>
          <DropdownMenuItem onClick={() => openDeleteWebhookDialog(id)}>
            <span className="truncate text-sm text-foreground-danger">
              {t('views:webhookData.delete', 'Delete webhook')}
            </span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
