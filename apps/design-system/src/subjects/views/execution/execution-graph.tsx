import { ExecutionHeader, ExecutionState, ExecutionTabs } from '@harnessio/ui/views'

export const ExecutionGraphView = () => {
  return (
    <div className="flex flex-col h-full">
      <ExecutionTabs />
      <ExecutionHeader
        commitName="8fbru3ix"
        branchName="master"
        title={{ number: '311. ', title: 'Alerting docs: adds sns integration' }}
        storage="0 B"
        storageAverage="0 B / 250 MB"
        simpleOperation="27/100k"
        advancedOperations="2/50k"
        dataTransfer="4.21 kB/5 GB"
        branch="master"
        commit="b8bruh99h"
        status={ExecutionState.RUNNING}
        buildTime="1h 30m"
        createdTime="10 mins ago"
        pipelineName="build scan push test - k8s - Clone 2"
      />
    </div>
  )
}
