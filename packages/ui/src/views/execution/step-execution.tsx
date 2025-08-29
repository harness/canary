import { ChangeEvent, FC, useState } from 'react'

import { Button, IconV2, Layout, ScrollArea, SearchBox, Tabs } from '@/components'
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
      <SearchBox.Root
        width="full"
        placeholder="Find in logs"
        className="searchbox h-8"
        handleChange={handleInputChange}
        value={query}
      >
        <div className="absolute inset-y-0 right-1.5 my-auto flex h-5 w-8 items-center justify-center gap-1 rounded border border-cn-2 bg-cn-background-3">
          <IconV2 className="text-icons-3" name="apple-shortcut" size="2xs" />
          <span className="text-1 leading-none">F</span>
        </div>
      </SearchBox.Root>
      <div className="flex">
        <Button variant="outline" size="sm" iconOnly className="rounded-r-none border-r-0 border-cn-2" onClick={onCopy}>
          <IconV2 name="copy" className="size-4 text-icons-3" />
        </Button>
        <Button variant="outline" size="sm" className="rounded-none border-cn-2" onClick={onEdit}>
          <IconV2 name="edit-pencil" className="text-icons-3" size="sm" />
        </Button>
        <Button variant="outline" size="sm" className="rounded-l-none border-l-0 border-cn-2" onClick={onDownload}>
          <IconV2 name="download" className="text-icons-3" size="sm" />
        </Button>
      </div>
    </Layout.Horizontal>
  )
}

export const StepExecution: FC<StepExecutionProps> = ({ step, logs, onEdit, onDownload, onCopy, isDrawer = false }) => {
  const inputTable = step?.inputs || []
  const outputTable = step?.outputs || []
  const [query, setQuery] = useState('')
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setQuery(value)
  }

  return (
    <Tabs.Root defaultValue={StepExecutionTab.LOG}>
      <Layout.Vertical>
        <Layout.Horizontal justify="between" className="py-2.5 pl-5 pr-3.5">
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
            handleInputChange={handleInputChange}
          />
        </Layout.Horizontal>
        <Tabs.Content value={StepExecutionTab.LOG}>
          <ScrollArea className={cn(isDrawer ? 'h-[calc(100vh-196px)]' : 'h-[calc(100vh-278px)] border-t')}>
            <ConsoleLogs logs={logs} query={query} />
          </ScrollArea>
        </Tabs.Content>
        <Tabs.Content value={StepExecutionTab.INPUT}>
          {/*here is the execution details of input table */}
          <ScrollArea className="h-[calc(100vh-278px)] border-t pt-4">
            <KeyValueTable
              className="pt-2"
              tableSpec={inputTable}
              tableTitleName={'Input Name'}
              tableTitleVal={'Input Value'}
            />
          </ScrollArea>
        </Tabs.Content>
        <Tabs.Content value={StepExecutionTab.OUTPUT}>
          {/*here is the execution details of output table */}
          <ScrollArea className="h-[calc(100vh-278px)] border-t pt-4">
            <KeyValueTable
              className="pt-2"
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
