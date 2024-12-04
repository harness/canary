import { useEffect, useState } from 'react'

import cx from 'classnames'

import { Button, Icon, Text } from '@harnessio/canary'

import { Layout } from '../layout/layout'
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
        className={cx(
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
        className={cx(
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
  const stepCount = (stage?.steps || []).length
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
  }, [stage?.steps, selectedStepIndex])

  if (!stage || !stage?.steps) {
    return <></>
  }

  return (
    <Layout.Horizontal gap="space-x-0">
      <StepNavigation
        stepIndex={selectedStepIndex}
        onClickUp={() => {
          const index = selectedStepIndex - 1 > 0 ? selectedStepIndex - 1 : 0
          onStepNav(stage?.steps?.[index]?.number || 0)
          setSelectedStepIndex(index)
        }}
        onClickDown={() => {
          const index = selectedStepIndex + 1 < stepMaxIndex ? selectedStepIndex + 1 : stepMaxIndex
          onStepNav(stage?.steps?.[index]?.number || 0)
          setSelectedStepIndex(index)
        }}
        disableUp={selectedStepIndex === 0}
        disableDown={stepCount - 1 === selectedStepIndex}
      />
      <Layout.Vertical gap="space-y-2" className="flex-grow p-4">
        {stage?.group ? (
          <Layout.Horizontal gap="space-x-1" className="flex items-center">
            <Text className="text-stage text-sm">{stage.group}</Text>
            <Icon name="chevron-right" />
            <Text className="text-ring text-sm">{stage.name}</Text>
          </Layout.Horizontal>
        ) : (
          <Text>{stage.name}</Text>
        )}
        {step && <StepExecution step={step} logs={logs} onEdit={onEdit} onDownload={onDownload} onCopy={onCopy} />}
      </Layout.Vertical>
    </Layout.Horizontal>
  )
}
