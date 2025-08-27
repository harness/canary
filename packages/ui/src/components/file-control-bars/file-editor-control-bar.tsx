import { FC } from 'react'

import { StackedList, Tabs } from '@/components'

export interface FileEditorControlBarProps {
  showPreview?: boolean
}

export const FileEditorControlBar: FC<FileEditorControlBarProps> = ({ showPreview = true }) => {
  return (
    <StackedList.Root rounded="top">
      <StackedList.Item paddingX="md" paddingY="2xs" disableHover isHeader>
        <StackedList.Field
          title={
            <Tabs.List variant="ghost">
              <Tabs.Trigger value="edit">Edit</Tabs.Trigger>
              {showPreview && <Tabs.Trigger value="preview">Preview</Tabs.Trigger>}
            </Tabs.List>
          }
        />
      </StackedList.Item>
    </StackedList.Root>
  )
}
