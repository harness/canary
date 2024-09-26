import React from 'react'
import { Badge, Icon, Separator, Text } from '@harnessio/canary'
import moment from 'moment'
import { noop } from 'lodash-es'
import { ScrollArea } from '@harnessio/canary'
import { StageExecution } from './stage-execution'
import { data as mockExecution } from '../../pages/mocks/execution/mockExecution'
import { data as mockStepLogs } from '../../pages/mocks/execution/mockStepLogs'
import { Layout } from '../layout/layout'
import { ExecutionTree } from './execution-tree'
import { ExecutionStatus } from './execution-status'
import { ExecutionState } from './types'
import { ContactCard } from '../contact-card'
import { convertExecutionToTree } from './execution-tree-utils'
import { getFormattedDuration } from '../../utils/TimeUtils'

interface ExecutionProps {
  pipelineId: number
  executionId: number
}

export const ExecutionDetails: React.FC<ExecutionProps> = (): React.ReactElement => {
  const execution = mockExecution
  const stages = execution.stages
  if (!stages || !stages.length) return <Text>No stages found</Text>
  const stageIdx = 0
  const stepIdx = 0
  return (
    <Layout.Horizontal className="px-8">
      <div className="w-2/3">
        <StageExecution stage={stages[stageIdx]} selectedStepIdx={stepIdx} logs={mockStepLogs[stepIdx]} />
      </div>
      <ScrollArea className="w-1/3 h-[calc(100vh-16rem)] pt-4">
        <ContactCard authorEmail={execution.author_email} authorName={execution.author_name} />
        <div className="flex flex-col gap-2 my-5">
          <Text className="text-white text-base">{execution.message}</Text>
          <div className="flex gap-2 items-center">
            <Badge variant="secondary" className="bg-primary-foreground flex gap-1">
              <Layout.Horizontal gap="space-x-1" className="flex items-center">
                <Icon size={12} name={'tube-sign'} />
                <Text className="text-sm text-git pb-0.5">{execution.source}</Text>
              </Layout.Horizontal>
            </Badge>
            <span>to</span>
            <Badge variant="secondary" className="flex gap-1 bg-primary-foreground">
              <Layout.Horizontal gap="space-x-1" className="flex items-center">
                <Icon size={12} name={'git-branch'} />
                <Text className="text-sm text-git pb-0.5">{execution.target}</Text>
              </Layout.Horizontal>
            </Badge>
          </div>
        </div>
        <Layout.Horizontal>
          <Layout.Vertical gap="space-y-1">
            <Text className="text-sm text-muted-foreground">Status</Text>
            <ExecutionStatus.Badge
              status={execution.status as ExecutionState}
              minimal
              duration={getFormattedDuration(execution.started, execution.finished)}
            />
          </Layout.Vertical>
          <Layout.Vertical gap="space-y-1">
            <Text className="text-sm text-muted-foreground">Created</Text>
            <span className="text-white">{moment(execution.created).fromNow()}</span>
          </Layout.Vertical>
        </Layout.Horizontal>
        <Separator className="my-4" />
        <ExecutionTree
          defaultSelectedId="stage-0"
          elements={convertExecutionToTree(mockExecution)}
          onSelectNode={noop}
        />
      </ScrollArea>
    </Layout.Horizontal>
  )
}
