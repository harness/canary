import { ChangeEvent, FC, useState } from 'react'

import { Button, Icon, ScrollArea, SearchBox, Text } from '@harnessio/canary'
import { Tabs } from '@harnessio/ui/components'

import { getFormattedDuration } from '../../utils/TimeUtils'
import { Layout } from '../layout/layout'
import ConsoleLogs from './console-logs'
import { ExecutionStatus } from './execution-status'
import { KeyValuePair, KeyValueTable } from './key-value-table'
import { ExecutionState, LivelogLine } from './types'

export interface StepProps {
  name?: string
  status: ExecutionState
  started?: number
  stopped?: number
  inputs?: KeyValuePair[]
  outputs?: KeyValuePair[]
  number?: number
}

interface StepExecutionProps {
  step: StepProps
  logs: LivelogLine[]
  onEdit: () => void
  onDownload: () => void
  onCopy: () => void
  query?: string
  handleInputChange?: (event: ChangeEvent<HTMLInputElement>) => void
}

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

export const StepExecution: FC<StepExecutionProps> = ({ step, logs, onEdit, onDownload, onCopy }) => {
  const inputTable = step?.inputs || []
  const outputTable = step?.outputs || []
  const [query, setQuery] = useState('')
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setQuery(value)
  }

  if (!step) return null
  return (
    <Layout.Vertical>
      <Layout.Horizontal className="flex items-center justify-between">
        <Text className="text-lg">{step?.name}</Text>
        <ExecutionStatus.Badge
          status={step?.status}
          duration={getFormattedDuration(step?.started ?? 0, step?.stopped ?? 0)}
        />
      </Layout.Horizontal>
      <Tabs.Root defaultValue={StepExecutionTab.LOG} className="mt-2 size-full">
        <Layout.Vertical gap="space-y-3">
          <Layout.Horizontal className="flex justify-between">
            <Tabs.List className="w-fit">
              <Tabs.Trigger className="h-full" value={StepExecutionTab.LOG}>
                Logs
              </Tabs.Trigger>
              <Tabs.Trigger value={StepExecutionTab.INPUT}>Inputs</Tabs.Trigger>
              <Tabs.Trigger value={StepExecutionTab.OUTPUT}>Output</Tabs.Trigger>
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
            <ScrollArea className="h-[calc(100vh-23rem)] border-t pt-4">
              <ConsoleLogs logs={logs} query={query} />
            </ScrollArea>
          </Tabs.Content>
          <Tabs.Content value={StepExecutionTab.INPUT}>
            {/*here is the execution details of input table */}
            <ScrollArea className="h-[calc(100vh-23rem)] border-t pt-4">
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
            <ScrollArea className="h-[calc(100vh-23rem)] border-t pt-4">
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
    </Layout.Vertical>
  )
}
