import { StackedList, Tabs } from '@/components'

export const FileEditorControlBar= () => {
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
