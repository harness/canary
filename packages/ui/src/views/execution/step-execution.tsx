import { ChangeEvent, FC, useState } from 'react'

import { Button, Icon, Layout, ScrollArea, SearchBox, Tabs, TabsTriggerProps } from '@/components'
import { useTheme } from '@/context'
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
        <div className="border-borders-2 bg-background-3 absolute inset-y-0 right-1.5 my-auto flex h-5 w-8 items-center justify-center gap-1 rounded border">
          <Icon className="text-icons-3" name="command-symbol" size={10} />
          <span className="text-12 leading-none">F</span>
        </div>
      </SearchBox.Root>
      <div className="flex">
        <Button variant="outline" size="icon" className="border-borders-1 rounded-r-none border-r-0" onClick={onCopy}>
          <Icon name="clone" className="text-icons-3 size-4" />
        </Button>
        <Button variant="outline" size="icon" className="border-borders-1 rounded-none" onClick={onEdit}>
          <Icon name="edit-pen" className="text-icons-3 size-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="border-borders-1 rounded-l-none border-l-0"
          onClick={onDownload}
        >
          <Icon name="download" className="text-icons-3 size-4" />
        </Button>
      </div>
    </Layout.Horizontal>
  )
}

const TabsTrigger = ({ isLightTheme, ...props }: TabsTriggerProps & { isLightTheme?: boolean }) => (
  <Tabs.Trigger
    className={cn(
      'h-6 w-[68px]',
      isLightTheme
        ? 'data-[state=active]:bg-background-1 data-[state=active]:shadow-none'
        : 'data-[state=active]:bg-background-9 data-[state=active]:border-borders-2 data-[state=active]:border'
    )}
    {...props}
  />
)

export const StepExecution: FC<StepExecutionProps> = ({ step, logs, onEdit, onDownload, onCopy, isDrawer = false }) => {
  const inputTable = step?.inputs || []
  const outputTable = step?.outputs || []
  const [query, setQuery] = useState('')
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setQuery(value)
  }
  const { isLightTheme } = useTheme()

  return (
    <Tabs.Root defaultValue={StepExecutionTab.LOG} className="size-full">
      <Layout.Vertical className="space-y-0">
        <Layout.Horizontal className="flex justify-between py-2.5 pl-5 pr-3.5">
          <Tabs.List className="border-borders-1 bg-background-3 h-8 w-fit gap-x-0.5 border">
            <TabsTrigger isLightTheme={isLightTheme} value={StepExecutionTab.LOG}>
              Logs
            </TabsTrigger>
            <TabsTrigger isLightTheme={isLightTheme} value={StepExecutionTab.INPUT}>
              Inputs
            </TabsTrigger>
            <TabsTrigger isLightTheme={isLightTheme} value={StepExecutionTab.OUTPUT}>
              Outputs
            </TabsTrigger>
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
