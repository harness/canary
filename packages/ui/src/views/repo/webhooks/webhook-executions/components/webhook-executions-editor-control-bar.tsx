import { FC } from 'react'

import { StackedList, ToggleGroup } from '@/components'

export interface FileEditorControlBarProps {
  view: string
  onChangeView: (value: 'Payload' | 'Server Response') => void
}

export const WebhookExecutionEditorControlBar: FC<FileEditorControlBarProps> = ({ view, onChangeView }) => {
  return (
    <StackedList.Root onlyTopRounded borderBackground>
      <StackedList.Item disableHover isHeader className="px-4 py-3">
        <ToggleGroup.Root
          className="gap-0"
          onValueChange={onChangeView}
          value={view}
          type="single"
          unselectable={'on'}
          size="xs"
        >
          <ToggleGroup.Item value="payload" className="text-md">
            Payload
          </ToggleGroup.Item>
          <ToggleGroup.Item value="server-response" className="text-md">
            Server Response
          </ToggleGroup.Item>
        </ToggleGroup.Root>
      </StackedList.Item>
    </StackedList.Root>
  )
}
