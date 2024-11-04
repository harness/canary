import {
  Badge,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Icon,
  StackedList,
  Text
} from '@harnessio/canary'
import React from 'react'

export enum WebhookState {
  DISABLED = 'Disabled',
  ENABLED = 'Enabled'
}

interface Webhook {
  id: number
  enabled: boolean
  display_name: string
  description?: string
  // timestamp: string
}

interface PageProps {
  webhooks?: Webhook[]
  LinkComponent: React.ComponentType<{ to: string; children: React.ReactNode }>
}

const Title = ({ title, enabled }: { title: string; enabled: boolean }) => {
  return (
    <div className="inline-flex gap-2 items-center">
      <Text truncate>{title}</Text>
      {enabled ? (
        // TODO: Update Badge component with standarized color variants
        <Badge
          variant="outline"
          size="xs"
          className="rounded-full border-emerald-400/20 text-emerald-300 bg-emerald-400/10">
          <Text size={0} className="text-inherit">
            {WebhookState.ENABLED}
          </Text>
        </Badge>
      ) : (
        <Badge variant="outline" size="xs" className="rounded-full text-tertiary-background">
          <Text size={1} className="text-inherit">
            {WebhookState.DISABLED}
          </Text>
        </Badge>
      )}
    </div>
  )
}

const Action = ({ id }: { id: number }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Icon name="vertical-ellipsis" size={14} className="text-tertiary-background" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="relative z-10">
        <DropdownMenuItem key={id}>Edit webhook</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export const WebhooksList = ({ webhooks, LinkComponent }: PageProps) => {
  return (
    <>
      {webhooks && webhooks.length > 0 && (
        <StackedList.Root>
          {webhooks.map((webhook, webhook_idx) => (
            <LinkComponent to={`create/${webhook.id.toString()}`}>
              <StackedList.Item key={webhook.display_name} isLast={webhooks.length - 1 === webhook_idx}>
                <StackedList.Field
                  title={<Title title={webhook.display_name} enabled={webhook.enabled} />}
                  description={webhook.description}
                />
                <StackedList.Field label secondary title={<Action id={webhook.id} />} right />
              </StackedList.Item>
            </LinkComponent>
          ))}
        </StackedList.Root>
      )}
    </>
  )
}
