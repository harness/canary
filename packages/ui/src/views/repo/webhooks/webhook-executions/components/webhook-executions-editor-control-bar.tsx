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
          variant="ghost"
          selectedVariant="secondary"
          onChange={onChangeView as (value: string) => void}
          value={view}
          unselectable
          size="xs"
        >
          <ToggleGroup.Item value="payload" className="text-md" text="Payload" />
          <ToggleGroup.Item value="server-response" className="text-md" text="Server Response" />
        </ToggleGroup.Root>
      </StackedList.Item>
    </StackedList.Root>
  )
}
