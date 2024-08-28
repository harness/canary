import React from 'react'
import { ExecutionDetails } from '../components/execution/execution-details'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@harnessio/canary'

export enum ExecutionTab {
  SUMMARY = 'summary',
  LOG = 'log',
  INPUT = 'input',
  POLICY = 'policy',
  ARTIFACT = 'artifact',
  TEST = 'test',
  SECURITY = 'security'
}

export default function ExecutionDetailsPage() {
  return (
    <Tabs variant="navigation" defaultValue={ExecutionTab.LOG}>
      {/* tab height */}
      <TabsList>
        <TabsTrigger value={ExecutionTab.SUMMARY}>Summary</TabsTrigger>
        {/* Need to manually adjust height to make bottom border align with parent */}
        <TabsTrigger className="h-full" value={ExecutionTab.LOG}>
          Logs
        </TabsTrigger>
        <TabsTrigger value={ExecutionTab.INPUT}>Inputs</TabsTrigger>
        <TabsTrigger value={ExecutionTab.POLICY}>Policy Evaluations</TabsTrigger>
        <TabsTrigger value={ExecutionTab.ARTIFACT}>Artifacts</TabsTrigger>
        <TabsTrigger value={ExecutionTab.TEST}>Tests</TabsTrigger>
        <TabsTrigger value={ExecutionTab.SECURITY}>Security Tests</TabsTrigger>
      </TabsList>
      <TabsContent value={ExecutionTab.SUMMARY} />
      <TabsContent value={ExecutionTab.LOG}>
        {/**
         * @TODO replace with actual values
         */}
        <ExecutionDetails executionId={1} pipelineId={1} />
      </TabsContent>
    </Tabs>
  )
}
