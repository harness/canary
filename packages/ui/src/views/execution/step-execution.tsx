import { useState } from 'react'

import { Button, Icon, Layout, ScrollArea, SearchBox, Tabs, TabsContent, TabsList, TabsTrigger } from '@/components'

import ConsoleLogs from './console-logs'
import { KeyValueTable } from './key-value-table'
import { StepExecutionProps } from './types'

enum StepExecutionTab {
  LOG = 'log',
  INPUT = 'input',
  OUTPUT = 'output'
}

const StepExecutionToolbar: React.FC<
  Pick<StepExecutionProps, 'onEdit' | 'onDownload' | 'onCopy' | 'query' | 'handleInputChange'>
> = ({ onEdit, onDownload, onCopy, query, handleInputChange }) => {
  return (
    <Layout.Horizontal>
      <SearchBox.Root
        width="full"
        placeholder="Find in logs"
        className="searchbox h-9"
        handleChange={handleInputChange}
        value={query}
      />
      <div className="flex">
        <Button variant="outline" size="icon" className="rounded-r-none border-r-0" onClick={onCopy}>
          <Icon name="clone" className="size-4" />
        </Button>
        <Button variant="outline" size="icon" className="rounded-none" onClick={onEdit}>
          <Icon name="edit-pen" className="size-4" />
        </Button>
        <Button variant="outline" size="icon" className="rounded-l-none border-l-0" onClick={onDownload}>
          <Icon name="download" className="size-4" />
        </Button>
      </div>
    </Layout.Horizontal>
  )
}

export const StepExecution: React.FC<StepExecutionProps> = ({ step, logs, onEdit, onDownload, onCopy }) => {
  const inputTable = step?.inputs || []
  const outputTable = step?.outputs || []
  const [query, setQuery] = useState('')
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setQuery(value)
  }

  return (
    <Tabs defaultValue={StepExecutionTab.LOG} className="size-full">
      <Layout.Vertical>
        <Layout.Horizontal className="flex justify-between p-4 pb-0">
          <TabsList className="w-fit">
            <TabsTrigger className="h-full" value={StepExecutionTab.LOG}>
              Logs
            </TabsTrigger>
            <TabsTrigger value={StepExecutionTab.INPUT}>Inputs</TabsTrigger>
            <TabsTrigger value={StepExecutionTab.OUTPUT}>Output</TabsTrigger>
          </TabsList>
          <StepExecutionToolbar
            onEdit={onEdit}
            onDownload={onDownload}
            onCopy={onCopy}
            query={query}
            handleInputChange={handleInputChange}
          />
        </Layout.Horizontal>
        <TabsContent value={StepExecutionTab.LOG}>
          <ScrollArea className="h-[calc(100vh-23rem)] border-t px-2 pt-4">
            <ConsoleLogs logs={logs} query={query} />
          </ScrollArea>
        </TabsContent>
        <TabsContent value={StepExecutionTab.INPUT}>
          {/*here is the execution details of input table */}
          <ScrollArea className="h-[calc(100vh-23rem)] border-t pt-4">
            <KeyValueTable
              className="pt-2"
              tableSpec={inputTable}
              tableTitleName={'Input Name'}
              tableTitleVal={'Input Value'}
            />
          </ScrollArea>
        </TabsContent>
        <TabsContent value={StepExecutionTab.OUTPUT}>
          {/*here is the execution details of output table */}
          <ScrollArea className="h-[calc(100vh-23rem)] border-t pt-4">
            <KeyValueTable
              className="pt-2"
              tableSpec={outputTable}
              tableTitleName={'Output Name'}
              tableTitleVal={'Output Value'}
            />
          </ScrollArea>
        </TabsContent>
      </Layout.Vertical>
    </Tabs>
  )
}
