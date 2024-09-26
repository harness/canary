import React, { useEffect, useState } from 'react'
import cx from 'classnames'
import { Button, Text } from '@harnessio/canary'
import { NavArrowDown, NavArrowRight, NavArrowUp } from '@harnessio/icons-noir'
import { StepExecution, StepProps } from './step-execution'
import { Layout } from '../layout/layout'
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
    <Layout.Horizontal gap="space-x-2" className="h-fit mt-12 pt-0.5">
      <Button
        asChild
        onClick={onClickUp}
        disabled={stepIndex === 0}
        variant="ghost"
        className={cx(
          'w-4 h-4 p-2 rounded-sm bg-secondary',
          { ['cursor-pointer']: !disableUp },
          { ['cursor-not-allowed']: disableUp }
        )}>
        <div>
          <NavArrowUp color="white" />
        </div>
      </Button>

      <Button
        asChild
        onClick={onClickDown}
        disabled={stepIndex === 0}
        variant="ghost"
        className={cx(
          'w-4 h-4 p-2 rounded-sm bg-secondary',
          { ['cursor-pointer']: !disableDown },
          { ['cursor-not-allowed']: disableDown }
        )}>
        <div>
          <NavArrowDown color="white" />
        </div>
      </Button>
    </Layout.Horizontal>
  )
}

export const StageExecution: React.FC<StageExecutionProps> = ({ stage, selectedStepIdx, logs }): React.ReactElement => {
  if (!stage || !stage?.steps) {
    return <Text>No steps found</Text>
  }
  const [selectedStepIndex, setSelectedStepIndex] = useState<number>(0)
  const [step, setStep] = useState<StepProps>()
  const stepCount = (stage.steps || []).length
  const stepMaxIndex = stepCount > 1 ? stepCount - 1 : 0

  useEffect(() => {
    if (selectedStepIdx >= 0) {
      setSelectedStepIndex(selectedStepIdx)
    }
  }, [selectedStepIdx])

  useEffect(() => {
    if (stage && stage?.steps && stage.steps.length >= 0 && selectedStepIndex >= 0) {
      setStep(stage.steps[selectedStepIndex])
    }
  }, [stage.steps, selectedStepIndex])

  return (
    <Layout.Horizontal gap="space-x-0">
      <StepNavigation
        stepIndex={selectedStepIndex}
        onClickUp={() => setSelectedStepIndex(currIdx => (currIdx - 1 > 0 ? currIdx - 1 : 0))}
        onClickDown={() => setSelectedStepIndex(currIdx => (currIdx + 1 < stepMaxIndex ? currIdx + 1 : stepMaxIndex))}
        disableUp={selectedStepIndex === 0}
        disableDown={stepCount - 1 === selectedStepIndex}
      />
      <Layout.Vertical gap="space-y-2" className="p-4 flex-grow">
        {stage?.group ? (
          <Layout.Horizontal gap="space-x-1" className="flex items-center">
            <Text className="text-stage text-sm">{stage.group}</Text>
            <NavArrowRight />
            <Text className="text-ring text-sm">{stage.name}</Text>
          </Layout.Horizontal>
        ) : (
          <Text>{stage.name}</Text>
        )}
        {step && <StepExecution step={step} logs={logs} />}
      </Layout.Vertical>
    </Layout.Horizontal>
  )
}
