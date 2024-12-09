import { EditViewTypeValue, StackedList, ToggleGroup, ToggleGroupItem } from '@/components'

export interface FileEditorControlBarProps {
  view: EditViewTypeValue
  onChangeView: (value: EditViewTypeValue) => void
}

export const FileEditorControlBar = ({ view, onChangeView }: FileEditorControlBarProps) => {
  return (
    <StackedList.Root onlyTopRounded borderBackground>
      <StackedList.Item disableHover isHeader className="px-4 py-1.5">
        <ToggleGroup
          className="gap-0"
          onValueChange={onChangeView}
          value={view}
          type="single"
          unselectable={'on'}
          size="xs"
        >
          <ToggleGroupItem value={'edit'}>Edit</ToggleGroupItem>
          <ToggleGroupItem value={'preview'}>Preview</ToggleGroupItem>
        </ToggleGroup>
      </StackedList.Item>
    </StackedList.Root>
  )
}
