import { FC } from 'react'

import { StackedList, Tabs } from '@/components'

export enum WebhookExecutionView {
  PAYLOAD = 'payload',
  SERVER_RESPONSE = 'server-response'
}

const TAB_LABELS = {
  [WebhookExecutionView.PAYLOAD]: 'Payload',
  [WebhookExecutionView.SERVER_RESPONSE]: 'Server Response'
}

export interface FileEditorControlBarProps {
  view: string
  onChangeView: (value: string) => void
}

export const WebhookExecutionEditorControlBar: FC<FileEditorControlBarProps> = ({ view, onChangeView }) => {
  return (
    <StackedList.Root onlyTopRounded borderBackground className="border-cn-borders-3">
      <StackedList.Item disableHover isHeader className="px-4 py-1">
        <Tabs.Root defaultValue={view} onValueChange={onChangeView}>
          <Tabs.List variant="ghost">
            <Tabs.Trigger value={WebhookExecutionView.PAYLOAD}>{TAB_LABELS[WebhookExecutionView.PAYLOAD]}</Tabs.Trigger>
            <Tabs.Trigger value={WebhookExecutionView.SERVER_RESPONSE}>
              {TAB_LABELS[WebhookExecutionView.SERVER_RESPONSE]}
            </Tabs.Trigger>
          </Tabs.List>
        </Tabs.Root>
      </StackedList.Item>
    </StackedList.Root>
  )
}
