import { FC } from 'react'

import {
  Button,
  DropdownMenu,
  FileToolbarActions,
  IconV2,
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
              <IconV2 name="more-horizontal" />
            </Button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content align="end">
            <DropdownMenu.Item onSelect={handleViewRaw} title="View Raw" />
            <DropdownMenu.Item
              onSelect={handleOpenDeleteDialog}
              title={<span className="truncate text-sm text-cn-foreground-danger">Delete</span>}
            />
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </Layout.Horizontal>
    )
  }

  return (
    <StackedList.Root onlyTopRounded borderBackground>
      <StackedList.Item disableHover isHeader className="px-4 py-1.5">
        <ToggleGroup.Root
          variant="ghost"
          selectedVariant="secondary"
          onChange={onChangeView as (value: string) => void}
          value={view}
          unselectable
          size="xs"
        >
          {isMarkdown && <ToggleGroup.Item value={'preview'} text="Preview" />}
          <ToggleGroup.Item value={'code'} text="Code" />
          <ToggleGroup.Item value={'blame'} text="Blame" />
          <ToggleGroup.Item value={'history'} text="History" />
        </ToggleGroup.Root>
        <StackedList.Field right title={<RightDetails />} />
      </StackedList.Item>
    </StackedList.Root>
  )
}
