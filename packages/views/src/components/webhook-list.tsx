import { Link } from 'react-router-dom'

import {
  Badge,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
  Icon,
  StackedList,
  Text
} from '@harnessio/canary'

export enum WebhookState {
  DISABLED = 'Disabled',
  ENABLED = 'Enabled'
}

interface Webhook {
  id?: number
  enabled?: boolean
  display_name?: string
  description?: string
  // timestamp: string
}

interface PageProps {
  webhooks?: Webhook[]
  LinkComponent: React.ComponentType<{ to: string; children: React.ReactNode }>
  openDeleteWebhookDialog: (id: number) => void
}

const Title = ({ title, enabled }: { title: string; enabled: boolean }) => {
  return (
    <div className="inline-flex items-center gap-2">
      <Text truncate>{title}</Text>
      {enabled ? (
        // TODO: Update Badge component with standarized color variants
        <Badge
          variant="outline"
          size="xs"
          className="rounded-full border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
        >
          <Text size={0} className="text-inherit">
            {WebhookState.ENABLED}
          </Text>
        </Badge>
      ) : (
        <Badge variant="outline" size="xs" className="text-tertiary-background rounded-full">
          <Text size={1} className="text-inherit">
            {WebhookState.DISABLED}
          </Text>
        </Badge>
      )}
    </div>
  )
}

const Action = ({ id, openDeleteWebhookDialog }: { id: number; openDeleteWebhookDialog: (id: number) => void }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="xs">
          <Icon name="vertical-ellipsis" size={14} className="text-tertiary-background cursor-pointer" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <Link to={`create/${id}`}>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={e => {
                e.stopPropagation()
              }}
            >
              <DropdownMenuShortcut className="ml-0">
                <Icon name="edit-pen" className="mr-2" />
              </DropdownMenuShortcut>
              Edit webhook
            </DropdownMenuItem>
          </Link>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-destructive cursor-pointer"
            onClick={e => {
              e.stopPropagation()
              openDeleteWebhookDialog(id)
            }}
          >
            <DropdownMenuShortcut className="ml-0">
              <Icon name="trash" className="text-destructive mr-2" />
            </DropdownMenuShortcut>
            Delete webhook
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export const WebhooksList = ({ webhooks, LinkComponent, openDeleteWebhookDialog }: PageProps) => {
  return (
    <>
      {webhooks && webhooks.length > 0 && (
        <StackedList.Root>
          {webhooks.map((webhook, webhook_idx) => (
            <LinkComponent key={webhook.id} to={`create/${(webhook.id ?? '').toString()}`}>
              <StackedList.Item key={webhook.display_name} isLast={webhooks.length - 1 === webhook_idx}>
                <StackedList.Field
                  title={<Title title={webhook.display_name ?? ''} enabled={webhook.enabled ?? false} />}
                  description={webhook.description}
                />
                <StackedList.Field
                  label
                  secondary
                  title={<Action id={webhook.id ?? 0} openDeleteWebhookDialog={openDeleteWebhookDialog} />}
                  right
                />
              </StackedList.Item>
            </LinkComponent>
          ))}
        </StackedList.Root>
      )}
    </>
  )
}
