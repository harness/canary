import { useState } from 'react'

import { Button, Icon, Layout, ScrollArea, SearchBox, Tabs, TabsContent, TabsList, TabsTrigger } from '@/components'
import { cn } from '@utils/cn'

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
        className="searchbox h-8"
        handleChange={handleInputChange}
        value={query}
      >
        <div className="absolute inset-y-0 right-1.5 my-auto flex h-5 w-8 items-center justify-center gap-1 rounded border border-borders-2 bg-background-3">
          <Icon className="text-icons-3" name="command-symbol" size={10} />
          <span className="text-12 leading-none">F</span>
        </div>
      </SearchBox.Root>
      <div className="flex">
        <Button variant="outline" size="icon" className="rounded-r-none border-r-0 border-borders-1" onClick={onCopy}>
          <Icon name="clone" className="size-4 text-icons-3" />
        </Button>
        <Button variant="outline" size="icon" className="rounded-none border-borders-1" onClick={onEdit}>
          <Icon name="edit-pen" className="size-4 text-icons-3" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="rounded-l-none border-l-0 border-borders-1"
          onClick={onDownload}
        >
          <Icon name="download" className="size-4 text-icons-3" />
        </Button>
      </div>
    </Layout.Horizontal>
  )
}

export const StepExecution: React.FC<StepExecutionProps> = ({
  step,
  logs,
  onEdit,
  onDownload,
  onCopy,
  isDrawer = false
}) => {
  const inputTable = step?.inputs || []
  const outputTable = step?.outputs || []
  const [query, setQuery] = useState('')
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setQuery(value)
  }

  return (
    <Tabs defaultValue={StepExecutionTab.LOG} className="size-full">
      <Layout.Vertical className="space-y-0">
        <Layout.Horizontal className="flex justify-between py-2.5 pl-5 pr-3.5">
          <TabsList className="h-8 w-fit gap-x-0.5 border border-borders-1 bg-background-3">
            <TabsTrigger
              className="h-6 w-[68px] data-[state=active]:border data-[state=active]:border-borders-2 data-[state=active]:bg-background-9"
              value={StepExecutionTab.LOG}
            >
              Logs
            </TabsTrigger>
            <TabsTrigger
              className="h-6 w-[68px] data-[state=active]:border data-[state=active]:border-borders-2 data-[state=active]:bg-background-9"
              value={StepExecutionTab.INPUT}
            >
              Inputs
            </TabsTrigger>
            <TabsTrigger
              className="h-6 w-[68px] data-[state=active]:border data-[state=active]:border-borders-2 data-[state=active]:bg-background-9"
              value={StepExecutionTab.OUTPUT}
            >
              Output
            </TabsTrigger>
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
          <ScrollArea className={cn(isDrawer ? 'pt-1.5 h-[calc(100vh-196px)]' : 'pt-4 h-[calc(100vh-278px)] border-t')}>
            <ConsoleLogs logs={logs} query={query} />
          </ScrollArea>
        </TabsContent>
        <TabsContent value={StepExecutionTab.INPUT}>
          {/*here is the execution details of input table */}
          <ScrollArea className="h-[calc(100vh-278px)] border-t pt-4">
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
          <ScrollArea className="h-[calc(100vh-278px)] border-t pt-4">
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
