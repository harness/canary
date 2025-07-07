import { FC } from 'react'

import { EditViewTypeValue, StackedList, ToggleGroup } from '@/components'

export interface FileEditorControlBarProps {
  view: EditViewTypeValue
  onChangeView: (value: EditViewTypeValue) => void
}

export const FileEditorControlBar: FC<FileEditorControlBarProps> = ({ view, onChangeView }) => {
  return (
    <StackedList.Root onlyTopRounded borderBackground>
      <StackedList.Item disableHover isHeader className="px-4 py-1.5">
        <ToggleGroup.Root
          onChange={onChangeView as (value: string) => void}
          value={view}
          unselectable
          size="xs"
          variant="ghost"
          selectedVariant="secondary"
        >
          <ToggleGroup.Item value={'edit'} text="Edit" />
          <ToggleGroup.Item value={'preview'} text="Preview" />
        </ToggleGroup.Root>
      </StackedList.Item>
    </StackedList.Root>
  )
}
