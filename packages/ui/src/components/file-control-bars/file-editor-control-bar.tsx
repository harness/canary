import { FC } from 'react'

import { EditViewTypeValue, StackedList, Tabs } from '@/components'

export interface FileEditorControlBarProps {
  view: EditViewTypeValue
  onChangeView: (value: EditViewTypeValue) => void
}

export const FileEditorControlBar: FC<FileEditorControlBarProps> = ({ view, onChangeView }) => {
  return (
    <StackedList.Root className="bg-cn-background-2" onlyTopRounded>
      <StackedList.Item disableHover isHeader className="px-cn-md py-cn-2xs">
        <Tabs.List variant="ghost">
          <Tabs.Trigger value="edit">Edit</Tabs.Trigger>
          <Tabs.Trigger value="preview">Preview</Tabs.Trigger>
        </Tabs.List>
      </StackedList.Item>
    </StackedList.Root>
  )
}
