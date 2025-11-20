import { FC, useCallback, useMemo } from 'react'

import { BranchSelectorTab } from '@views/repo/components/branch-selector-v2/types'

import {
  DropdownMenu,
  FileToolbarActions,
  IconV2,
  Layout,
  Separator,
  StackedList,
  Tabs,
  Tag,
  Text
} from '@harnessio/ui/components'
import { useCustomDialogTrigger } from '@harnessio/ui/context'

import { ViewTypeValue } from './types'

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
  isGitLfsObject?: boolean
}

export const FileViewerControlBar: FC<FileViewerControlBarProps> = ({
  view,
  isMarkdown,
  fileBytesSize,
  fileContent,
  url,
  isGitLfsObject,
  handleDownloadFile,
  handleEditFile,
  handleOpenDeleteDialog: _handleOpenDeleteDialog,
  refType = BranchSelectorTab.BRANCHES
}) => {
  const { triggerRef, registerTrigger } = useCustomDialogTrigger()

  const handleViewRaw = () => {
    window.open(url, '_blank')
  }

  const handleOpenDeleteDialog = useCallback(() => {
    registerTrigger()
    _handleOpenDeleteDialog()
  }, [_handleOpenDeleteDialog, registerTrigger])

  // Memoization here prevents items from re-rendering. Important for focusing the dialog trigger on close
  const rightDetails = useMemo(() => {
    return (
      <Layout.Horizontal gap="xl" align="center">
        {isGitLfsObject && <Tag value="Stored with Git LFS" icon="info-circle" />}
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
              ref: triggerRef,
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
  }, [
    fileBytesSize,
    fileContent,
    handleDownloadFile,
    handleEditFile,
    handleOpenDeleteDialog,
    handleViewRaw,
    isGitLfsObject,
    refType
  ])

  return (
    <StackedList.Root {...(view !== 'history' ? { rounded: 'top' } : {})}>
      <StackedList.Header paddingY="2xs">
        <StackedList.Field
          title={
            <Tabs.List variant="ghost">
              {isMarkdown && <Tabs.Trigger value="preview">Preview</Tabs.Trigger>}
              <Tabs.Trigger value="code">Code</Tabs.Trigger>
              <Tabs.Trigger value="blame">Blame</Tabs.Trigger>
              <Tabs.Trigger value="history">History</Tabs.Trigger>
            </Tabs.List>
          }
        />
        <StackedList.Field right title={rightDetails} />
      </StackedList.Header>
    </StackedList.Root>
  )
}
