import { FC } from 'react'

import {
  DropdownMenu,
  FileToolbarActions,
  IconV2,
  Layout,
  Separator,
  StackedList,
  Tabs,
  Text,
  ViewTypeValue
} from '@/components'
import { BranchSelectorTab } from '@views/repo/components/branch-selector-v2/types'

export interface FileViewerControlBarProps {
  view: ViewTypeValue
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
      <Layout.Horizontal gap="xl" align="center">
        <Layout.Horizontal gap="2xs" align="center">
          <Text color="foreground-3">{`${fileContent?.split('\n').length || 0} lines`}</Text>
          <Separator orientation="vertical" className="h-3" />
          <Text color="foreground-3">{fileBytesSize}</Text>
        </Layout.Horizontal>
        <FileToolbarActions
          showEdit={refType === BranchSelectorTab.BRANCHES}
          copyContent={fileContent}
          onDownloadClick={handleDownloadFile}
          onEditClick={handleEditFile}
          additionalButtonsProps={[
            {
              children: <IconV2 name="more-horizontal" />,
              'aria-label': 'More actions',
              dropdownProps: {
                content: (
                  <>
                    <DropdownMenu.Item onSelect={handleViewRaw} title="View Raw" />
                    <DropdownMenu.Item onSelect={handleOpenDeleteDialog} title={<Text color="danger">Delete</Text>} />
                  </>
                ),
                contentProps: {
                  align: 'end'
                }
              }
            }
          ]}
        />
      </Layout.Horizontal>
    )
  }

  return (
    <StackedList.Root className="bg-cn-background-2" onlyTopRounded={view !== 'history'}>
      <StackedList.Item disableHover isHeader className="px-cn-md py-cn-2xs gap-cn-sm flex-nowrap">
        <Tabs.List variant="ghost">
          {isMarkdown && <Tabs.Trigger value="preview">Preview</Tabs.Trigger>}
          <Tabs.Trigger value="code">Code</Tabs.Trigger>
          <Tabs.Trigger value="blame">Blame</Tabs.Trigger>
          <Tabs.Trigger value="history">History</Tabs.Trigger>
        </Tabs.List>
        <StackedList.Field right title={<RightDetails />} />
      </StackedList.Item>
    </StackedList.Root>
  )
}
