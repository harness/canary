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
        <ToggleGroup.Root onValueChange={onChangeView} value={view} unselectable size="xs" variant="ghost-secondary">
          <ToggleGroup.Item value={'edit'}>Edit</ToggleGroup.Item>
          <ToggleGroup.Item value={'preview'}>Preview</ToggleGroup.Item>
        </ToggleGroup.Root>
      </StackedList.Item>
    </StackedList.Root>
  )
}
