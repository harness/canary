import { FC } from 'react'

import {
  Button,
  DropdownMenu,
  FileToolbarActions,
  Icon,
  Layout,
  StackedList,
  ToggleGroup,
  ViewTypeValue
} from '@/components'
import { BranchSelectorTab } from '@views/repo/components/branch-selector-v2/types'

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
  refType?: BranchSelectorTab
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
  handleOpenDeleteDialog,
  refType = BranchSelectorTab.BRANCHES
}) => {
  const handleViewRaw = () => {
    window.open(url, '_blank')
  }

  const RightDetails = () => {
    return (
      <Layout.Horizontal gap="xs" align="center">
        <span className="text-sm text-cn-foreground-2">{`${fileContent?.split('\n').length || 0} lines`}</span>
        <span className="h-3 border-l border-cn-borders-2" />
        <span className="mr-5 text-sm text-cn-foreground-2">{fileBytesSize}</span>
        <FileToolbarActions
          showEdit={refType === BranchSelectorTab.BRANCHES}
          copyContent={fileContent}
          onDownloadClick={handleDownloadFile}
          onEditClick={handleEditFile}
        />
        <DropdownMenu.Root>
          <DropdownMenu.Trigger className="-mr-2" asChild>
            <Button variant="ghost" iconOnly>
              <Icon name="more-dots-fill" size={16} />
            </Button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content align="end">
            <DropdownMenu.Item onSelect={handleViewRaw}>
              <span className="truncate text-sm">View Raw</span>
            </DropdownMenu.Item>
            <DropdownMenu.Item onSelect={handleOpenDeleteDialog}>
              <span className="truncate text-sm text-cn-foreground-danger">Delete</span>
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </Layout.Horizontal>
    )
  }

  return (
    <StackedList.Root onlyTopRounded borderBackground>
      <StackedList.Item disableHover isHeader className="px-4 py-1.5">
        <ToggleGroup.Root
          className="gap-0"
          onValueChange={onChangeView}
          value={view}
          type="single"
          unselectable={'on'}
          size="xs"
        >
          {isMarkdown && <ToggleGroup.Item value={'preview'}>Preview</ToggleGroup.Item>}
          <ToggleGroup.Item value={'code'}>Code</ToggleGroup.Item>
          <ToggleGroup.Item value={'blame'}>Blame</ToggleGroup.Item>
          <ToggleGroup.Item value={'history'}>History</ToggleGroup.Item>
        </ToggleGroup.Root>
        <StackedList.Field right title={<RightDetails />} />
      </StackedList.Item>
    </StackedList.Root>
  )
}
