import { FC } from 'react'

import { StackedList, Tabs } from '@/components'

export interface FileEditorControlBarProps {
  showPreview?: boolean
}

export const FileEditorControlBar: FC<FileEditorControlBarProps> = ({ showPreview = true }) => {
  return (
    <StackedList.Root rounded="top">
      <StackedList.Header paddingY="2xs">
        <StackedList.Field
          title={
            <Tabs.List variant="ghost">
              <Tabs.Trigger value="edit">Edit</Tabs.Trigger>
              {showPreview && <Tabs.Trigger value="preview">Preview</Tabs.Trigger>}
            </Tabs.List>
          }
        />
      </StackedList.Header>
    </StackedList.Root>
  )
}
