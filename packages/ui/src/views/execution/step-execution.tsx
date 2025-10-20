import { FC, useState } from 'react'

import { Button, IconV2, Layout, ScrollArea, SearchInput, Shortcut, Tabs } from '@/components'
import { cn } from '@utils/cn'

import ConsoleLogs from './console-logs'
import { KeyValueTable } from './key-value-table'
import { StepExecutionProps } from './types'

enum StepExecutionTab {
  LOG = 'log',
  INPUT = 'input',
  OUTPUT = 'output'
}

const StepExecutionToolbar: FC<
  Pick<StepExecutionProps, 'onEdit' | 'onDownload' | 'onCopy' | 'query' | 'handleInputChange'>
> = ({ onEdit, onDownload, onCopy, query, handleInputChange }) => {
  return (
    <Layout.Horizontal>
      <SearchInput
        size="sm"
        defaultValue={query || ''}
        onChange={handleInputChange}
        placeholder="Find in logs"
        suffix={<Shortcut className="mr-cn-2xs">⌘K</Shortcut>}
        autoFocus
      />
      <div className="flex">
        <Button
          className="border-cn-2 rounded-r-none border-r-0"
          variant="outline"
          size="sm"
          iconOnly
          onClick={onCopy}
          tooltipProps={{
            content: 'Copy'
          }}
        >
          <IconV2 name="copy" className="size-4" />
        </Button>
        <Button variant="outline" size="sm" className="border-cn-2 rounded-none" onClick={onEdit}>
          <IconV2 name="edit-pencil" size="sm" />
        </Button>
        <Button variant="outline" size="sm" className="border-cn-2 rounded-l-none border-l-0" onClick={onDownload}>
          <IconV2 name="download" size="sm" />
        </Button>
      </div>
    </Layout.Horizontal>
  )
}

export const StepExecution: FC<StepExecutionProps> = ({ step, logs, onEdit, onDownload, onCopy, isDrawer = false }) => {
  const inputTable = step?.inputs || []
  const outputTable = step?.outputs || []
  const [query, setQuery] = useState('')

  return (
    <Tabs.Root defaultValue={StepExecutionTab.LOG}>
      <Layout.Vertical gapY="none">
        <Layout.Horizontal justify="between" className="py-cn-xs pl-cn-lg pr-cn-md" align="center">
          <Tabs.List variant="outlined">
            <Tabs.Trigger value={StepExecutionTab.LOG}>Logs</Tabs.Trigger>
            <Tabs.Trigger value={StepExecutionTab.INPUT}>Inputs</Tabs.Trigger>
            <Tabs.Trigger value={StepExecutionTab.OUTPUT}>Outputs</Tabs.Trigger>
          </Tabs.List>
          <StepExecutionToolbar
            onEdit={onEdit}
            onDownload={onDownload}
            onCopy={onCopy}
            query={query}
            handleInputChange={setQuery}
          />
        </Layout.Horizontal>
        <Tabs.Content value={StepExecutionTab.LOG}>
          <ScrollArea className={cn(isDrawer ? 'h-[calc(100vh-196px)]' : 'h-[calc(100vh-278px)] border-t')}>
            <ConsoleLogs logs={logs} query={query} />
          </ScrollArea>
        </Tabs.Content>
        <Tabs.Content value={StepExecutionTab.INPUT}>
          {/*here is the execution details of input table */}
          <ScrollArea className="h-[calc(100vh-278px)] border-t pt-cn-md">
            <KeyValueTable
              className="pt-cn-xs"
              tableSpec={inputTable}
              tableTitleName={'Input Name'}
              tableTitleVal={'Input Value'}
            />
          </ScrollArea>
        </Tabs.Content>
        <Tabs.Content value={StepExecutionTab.OUTPUT}>
          {/*here is the execution details of output table */}
          <ScrollArea className="h-[calc(100vh-278px)] border-t pt-cn-md">
            <KeyValueTable
              className="pt-cn-xs"
              tableSpec={outputTable}
              tableTitleName={'Output Name'}
              tableTitleVal={'Output Value'}
            />
          </ScrollArea>
        </Tabs.Content>
      </Layout.Vertical>
    </Tabs.Root>
  )
}
