import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger, Input, Button, Text, ScrollArea } from '@harnessio/canary'
import { Copy, Edit, Download } from '@harnessio/icons-noir'
import ConsoleLogs from './console-logs'
import { Layout } from '../layout/layout'
import { ExecutionState, ExecutionStatus } from './execution-status'
import { getFormattedDuration } from '../../utils/TimeUtils'
import { KeyValuePair, KeyValueTable } from './key-value-table'
import { LivelogLine } from './types'

export interface StepProps {
  name?: string
  status: ExecutionState
  started?: number
  stopped?: number
  inputs?: KeyValuePair[]
  outputs?: KeyValuePair[]
}

interface StepExecutionProps {
  step: StepProps
  logs: LivelogLine[]
}

enum StepExecutionTab {
  LOG = 'log',
  INPUT = 'input',
  OUTPUT = 'output'
}

const StepExecutionToolbar: React.FC = () => {
  return (
    <Layout.Horizontal>
      <Input placeholder="Find in logs" />
      <div className="flex">
        <Button variant="outline" size="icon" className="rounded-tr-none rounded-br-none border-r-0">
          <Copy className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" className="rounded-none">
          <Edit className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" className="rounded-tl-none rounded-bl-none border-l-0">
          <Download className="h-4 w-4" />
        </Button>
      </div>
    </Layout.Horizontal>
  )
}

export const StepExecution: React.FC<StepExecutionProps> = ({ step, logs }) => {
  if (!step) return null
  const inputTable = step?.inputs || []
  const outputTable = step?.outputs || []
  return (
    <Layout.Vertical>
      <Layout.Horizontal className="flex justify-between items-center">
        <Text className="text-lg">{step?.name}</Text>
        <ExecutionStatus.Badge
          status={step?.status}
          duration={getFormattedDuration(step?.started ?? 0, step?.stopped ?? 0)}
        />
      </Layout.Horizontal>
      <Tabs defaultValue={StepExecutionTab.LOG} className="w-full h-full mt-2">
        <Layout.Vertical gap="space-y-3">
          <Layout.Horizontal className="flex justify-between">
            <TabsList className="w-fit">
              <TabsTrigger className="h-full" value={StepExecutionTab.LOG}>
                Logs
              </TabsTrigger>
              <TabsTrigger value={StepExecutionTab.INPUT}>Inputs</TabsTrigger>
              <TabsTrigger value={StepExecutionTab.OUTPUT}>Output</TabsTrigger>
            </TabsList>
            <StepExecutionToolbar />
          </Layout.Horizontal>
          <TabsContent value={StepExecutionTab.LOG}>
            <ScrollArea className="h-[calc(100vh-23rem)] border-t pt-4">
              <ConsoleLogs logs={logs} />
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
    </Layout.Vertical>
  )
}
