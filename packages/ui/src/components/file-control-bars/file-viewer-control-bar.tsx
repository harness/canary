import { FC } from 'react'

import {
  Button,
  ButtonGroup,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  FileToolbarActions,
  Icon,
  StackedList,
  ToggleGroup,
  ToggleGroupItem,
  ViewTypeValue
} from '@/components'

export interface FileViewerControlBarProps {
  view: ViewTypeValue
  onChangeView: (value: ViewTypeValue) => void
  isMarkdown: boolean
  fileBytesSize: string
  fileContent: string
  url: string
  handleDownloadFile: () => void
  handleEditFile: () => void
  handleOpenDeleteDialog: () => void
}

export const FileViewerControlBar: FC<FileViewerControlBarProps> = ({
  view,
  onChangeView,
  isMarkdown,
  fileBytesSize,
  fileContent,
  url,
  handleDownloadFile,
  handleEditFile,
  handleOpenDeleteDialog
}) => {
  const handleViewRaw = () => {
    window.open(url, '_blank')
  }

  const RightDetails = () => {
    return (
      <ButtonGroup verticalAlign="center" spacing="2">
        <span className="text-sm text-foreground-4">{`${fileContent?.split('\n').length || 0} lines`}</span>
        <span className="h-3 border-l border-borders-2" />
        <span className="mr-5 text-sm text-foreground-4">{fileBytesSize}</span>
        <FileToolbarActions
          showEdit
          copyContent={fileContent}
          onDownloadClick={handleDownloadFile}
          onEditClick={handleEditFile}
        />
        <DropdownMenu>
          <DropdownMenuTrigger className="-mr-2" asChild>
            <Button
              className="text-icons-3 hover:text-icons-2 data-[state=open]:text-icons-2"
              variant="custom"
              size="icon"
            >
              <Icon name="more-dots-fill" size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={handleViewRaw}>
              <span className="truncate text-sm">View Raw</span>
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={handleOpenDeleteDialog}>
              <span className="truncate text-sm text-foreground-danger">Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </ButtonGroup>
    )
  }

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
          {isMarkdown && <ToggleGroupItem value={'preview'}>Preview</ToggleGroupItem>}
          <ToggleGroupItem value={'code'}>Code</ToggleGroupItem>
          <ToggleGroupItem value={'blame'}>Blame</ToggleGroupItem>
        </ToggleGroup>
        <StackedList.Field right title={<RightDetails />} />
      </StackedList.Item>
    </StackedList.Root>
  )
}
