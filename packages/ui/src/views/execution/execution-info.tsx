import { useEffect, useState } from 'react'

import { StepExecution } from './step-execution'
import { ExecutionInfoProps, StepProps } from './types'

export const ExecutionInfo: React.FC<ExecutionInfoProps> = ({
  stage,
  selectedStepIdx,
  useLogsStore,
  onEdit,
  onDownload,
  onCopy
}): React.ReactElement => {
  const { logs } = useLogsStore()
  const [selectedStepIndex, setSelectedStepIndex] = useState<number>(0)
  const [step, setStep] = useState<StepProps>()

  useEffect(() => {
    if (selectedStepIdx >= 0) {
      setSelectedStepIndex(selectedStepIdx)
    }
  }, [selectedStepIdx])

  useEffect(() => {
    if (stage && stage?.steps && stage.steps.length >= 0 && selectedStepIndex >= 0) {
      setStep(stage.steps[selectedStepIndex])
    }
  }, [stage?.steps, selectedStepIndex])

  if (!stage || !stage?.steps) {
    return <></>
  }

  return step ? (
    <StepExecution step={step} logs={logs || []} onEdit={onEdit} onDownload={onDownload} onCopy={onCopy} />
  ) : (
    <></>
  )
}
