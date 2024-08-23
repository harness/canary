import React from 'react'
import { Badge, Separator, Text } from '@harnessio/canary'
import { GitBranch, GitCommit } from '@harnessio/icons-noir'
import moment from 'moment'
import { StageExecution } from './stage-execution'
import { data as mockExecution } from './mocks/mockExecution'
import { Layout } from '../layout/layout'
import { ExecutionTree } from './execution-tree'
import { elements } from '../../assets/mockExecutionTree'
import { ExecutionStatus } from './execution-status'
import { getDuration } from '../../utils/TimeUtils'
import { ExecutionState } from './types'
import { ContactCard } from '../contact-card'
import { ScrollArea } from '@harnessio/canary'

interface ExecutionProps {
  pipelineId: unknown
  executionId: unknown
}

export const ExecutionDetails: React.FC<ExecutionProps> = (): React.ReactElement => {
  const execution = mockExecution
  const stages = execution.stages
  if (!stages || !stages.length) return <Text>No stages found</Text>
  return (
    <Layout.Horizontal className="px-8">
      {/* Hardcoded height added temporarily */}
      <div className="w-2/3">
        <StageExecution stage={stages[0]} />
      </div>
      <ScrollArea className="w-1/3 h-[calc(100vh-16rem)] pt-4">
        <ContactCard
          imgSrc="https://github.com/shadcn.png"
          authorName={execution.author_name || ''}
          authorEmail={execution.author_email || ''}
        />
        <div className="flex flex-col gap-2 my-5">
          <Text className="text-white text-base">{execution.message}</Text>
          <div className="flex gap-2 items-center">
            <Badge variant="secondary" className="bg-primary-foreground flex gap-1">
              <Layout.Horizontal gap="space-x-1" className="flex items-center">
                <GitCommit />
                <Text className="text-sm text-git">{execution.source}</Text>
              </Layout.Horizontal>
            </Badge>
            <span>to</span>
            <Badge variant="secondary" className="flex gap-1 bg-primary-foreground">
              <Layout.Horizontal gap="space-x-1" className="flex items-center">
                <GitBranch />
                <Text className="text-sm text-git">{execution.target}</Text>
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
              duration={getDuration(execution.started, execution.finished)}
            />
          </Layout.Vertical>
          <Layout.Vertical gap="space-y-1">
            <Text className="text-sm text-muted-foreground">Created</Text>
            <span className="text-white">{moment(execution.created).fromNow()}</span>
          </Layout.Vertical>
        </Layout.Horizontal>
        <Separator className="my-4" />
        <ExecutionTree defaultSelectedId="2" elements={elements} onSelectNode={() => {}} />
      </ScrollArea>
    </Layout.Horizontal>
  )
}
