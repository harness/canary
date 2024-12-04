import { useState } from 'react'

import { Button } from '@harnessio/canary'
import { useCancelExecutionMutation } from '@harnessio/code-service-client'

import RunPipelineDialog from '../run-pipeline-dialog/run-pipeline-dialog'

export interface isPipelineStillExecutingProps {
  isExecuting?: boolean
  pipelineIdentifier: string
  executionNum: string
  repoRef: string
  currentBranch: string
}

const ExecutionDetailsHeaderActions = (props: isPipelineStillExecutingProps): JSX.Element => {
  const { isExecuting, pipelineIdentifier, executionNum, repoRef, currentBranch } = props

  const [openRunPipeline, setOpenRunPipeline] = useState(false)

  const { mutateAsync: cancelExecution } = useCancelExecutionMutation({
    pipeline_identifier: pipelineIdentifier,
    execution_number: executionNum,
    repo_ref: repoRef
  })

  const handleAbort = async () => {
    try {
      await cancelExecution({})
    } catch (ex) {
      console.error(ex)
      // TODO: toast?
    }
    // TODO: toast?
  }

  return (
    <>
      <div className="absolute right-0 top-0 z-50 w-fit">
        <div className="flex h-14 items-center gap-x-3 px-4">
          {isExecuting ? (
            <Button size="sm" onClick={() => handleAbort()}>
              Abort
            </Button>
          ) : (
            <Button size="sm" onClick={() => setOpenRunPipeline(true)}>
              Run
            </Button>
          )}
        </div>
      </div>
      <RunPipelineDialog
        open={openRunPipeline}
        onClose={() => {
          setOpenRunPipeline(false)
        }}
        pipelineId={pipelineIdentifier}
        branch={currentBranch}
        toExecutions={'../executions'}
      />
    </>
  )
}

export default ExecutionDetailsHeaderActions
