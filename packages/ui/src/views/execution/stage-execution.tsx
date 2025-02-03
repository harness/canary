import { useEffect, useState } from 'react'

import { Button, Icon, Layout, Text } from '@/components'
import { cn } from '@utils/cn'

import { StepExecution, StepProps } from './step-execution'
import { LivelogLine } from './types'

export interface StageProps {
  name?: string
  group?: string
  steps?: StepProps[]
}

interface StageExecutionProps {
  stage: StageProps
  selectedStepIdx: number
  logs: LivelogLine[]
  onEdit: () => void
  onStepNav: (selectedStepIdx: number) => void
  onDownload: () => void
  onCopy: () => void
}

interface StepNavigationProps {
  stepIndex: number
  onClickUp: () => void
  onClickDown: () => void
  disableUp?: boolean
  disableDown?: boolean
}

const StepNavigation: React.FC<StepNavigationProps> = ({
  stepIndex,
  onClickUp,
  onClickDown,
  disableUp,
  disableDown
}) => {
  return (
    <Layout.Horizontal gap="space-x-2" className="mt-12 h-fit pt-0.5">
      <Button
        asChild
        onClick={onClickUp}
        disabled={stepIndex === 0}
        variant="ghost"
        className={cn(
          'bg-secondary h-4 w-4 rounded-sm p-2',
          { ['cursor-pointer']: !disableUp },
          { ['cursor-not-allowed']: disableUp }
        )}
      >
        <div>
          <Icon name="chevron-up" />
        </div>
      </Button>

      <Button
        asChild
        onClick={onClickDown}
        disabled={stepIndex === 0}
        variant="ghost"
        className={cn(
          'bg-secondary h-4 w-4 rounded-sm p-2',
          { ['cursor-pointer']: !disableDown },
          { ['cursor-not-allowed']: disableDown }
        )}
      >
        <div>
          <Icon name="chevron-down" />
        </div>
      </Button>
    </Layout.Horizontal>
  )
}

export const StageExecution: React.FC<StageExecutionProps> = ({
  stage,
  selectedStepIdx,
  logs,
  onEdit,
  onStepNav,
  onDownload,
  onCopy
}): React.ReactElement => {
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
    <StepExecution step={step} logs={logs} onEdit={onEdit} onDownload={onDownload} onCopy={onCopy} />
  ) : (
    <></>
  )
}
