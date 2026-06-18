import { useMemo } from 'react'

import { AlertDialog } from '../alert-dialog'
import { IconV2 } from '../icon-v2'
import { Layout } from '../layout'
import { Resizable } from '../resizable'
import { Stepper } from '../stepper'
import { Text } from '../text'
import { SplitPaneStepperCardStack } from './split-pane-stepper-card-stack'
import { FlowEngineProvider, useEngineContext } from './split-pane-stepper-context'
import { CardEntry, SplitPaneStepperRootProps } from './split-pane-stepper-types'

const DEFAULT_REACTIVATION_PROMPT = {
  title: 'Go back?',
  description: 'Going back to this step will discard your progress on subsequent steps. Are you sure?'
}

function SplitPaneStepperContent({
  title,
  icon,
  stepperTitle,
  contentTitle,
  contentSubtitle,
  drawers,
  onClose,
  leftPane,
  reactivationPrompt,
  panelSizes
}: Omit<SplitPaneStepperRootProps, 'flow' | 'onComplete'>) {
  const { drawerState, closeDrawer, pendingReactivation, confirmReactivation, cancelReactivation } = useEngineContext()

  const prompt = reactivationPrompt || DEFAULT_REACTIVATION_PROMPT
  const panels = { default: 30, min: 20, max: 40, ...panelSizes }
  const showHeader = !!(icon || title)

  const activeDrawer = useMemo(() => {
    if (!drawerState || !drawers) return null
    const DrawerComponent = drawers[drawerState.id]
    if (!DrawerComponent) return null
    return <DrawerComponent open={true} onClose={closeDrawer} props={drawerState.props} />
  }, [drawerState, drawers, closeDrawer])

  const defaultLeftPane = <DefaultStepperPane stepperTitle={stepperTitle} />

  return (
    <>
      <Layout.Vertical gap="none" className="cn-split-pane-stepper-root">
        {showHeader && (
          <Layout.Horizontal as="header" align="center" gap="sm" className="cn-split-pane-stepper-header">
            {icon}
            {title && (
              <Text as="h1" variant="heading-section" color="foreground-1" className="min-w-0 flex-1 !m-0">
                {title}
              </Text>
            )}
            {!title && <div className="flex-1" />}
            {onClose && (
              <button type="button" onClick={onClose} aria-label="Close" className="cn-split-pane-stepper-close-btn">
                <IconV2 name="xmark" size="sm" />
              </button>
            )}
          </Layout.Horizontal>
        )}

        <Resizable.PanelGroup direction="horizontal" className="cn-split-pane-stepper-panels">
          <Resizable.Panel defaultSize={panels.default} minSize={panels.min} maxSize={panels.max}>
            <div className="cn-split-pane-stepper-left-pane">{leftPane || defaultLeftPane}</div>
          </Resizable.Panel>

          <Resizable.Handle withHandle />

          <Resizable.Panel>
            <div className="cn-split-pane-stepper-right-pane">
              {(contentTitle || contentSubtitle) && (
                <Layout.Vertical gap="2xs" className="cn-split-pane-stepper-content-header">
                  {contentTitle && (
                    <Text as="h2" variant="heading-subsection" color="foreground-1" className="!m-0">
                      {contentTitle}
                    </Text>
                  )}
                  {contentSubtitle && (
                    <Text as="p" variant="body-normal" color="foreground-1" className="!m-0">
                      {contentSubtitle}
                    </Text>
                  )}
                </Layout.Vertical>
              )}
              <SplitPaneStepperCardStack />
            </div>
          </Resizable.Panel>
        </Resizable.PanelGroup>
      </Layout.Vertical>

      {activeDrawer}

      <AlertDialog.Root
        open={!!pendingReactivation}
        onOpenChange={open => {
          if (!open) cancelReactivation()
        }}
        onConfirm={confirmReactivation}
        onCancel={cancelReactivation}
        theme="warning"
      >
        <AlertDialog.Content title={prompt.title}>{prompt.description}</AlertDialog.Content>
      </AlertDialog.Root>
    </>
  )
}

function DefaultStepperPane({ stepperTitle }: { stepperTitle?: string }) {
  const { flow, cardHistory, activeSubStepId, predictedPath, scrollToCard } = useEngineContext()
  const activeStepId = flow.subSteps[activeSubStepId]?.step

  const visitedByStep: Record<string, CardEntry[]> = {}
  for (const entry of cardHistory) {
    const stepId = flow.subSteps[entry.subStepId]?.step
    if (stepId) {
      if (!visitedByStep[stepId]) visitedByStep[stepId] = []
      visitedByStep[stepId].push(entry)
    }
  }

  const predictedByStep: Record<string, string[]> = {}
  for (const subStepId of predictedPath) {
    const stepId = flow.subSteps[subStepId]?.step
    if (stepId) {
      if (!predictedByStep[stepId]) predictedByStep[stepId] = []
      predictedByStep[stepId].push(subStepId)
    }
  }

  const handleStepperClick = (value: string) => {
    const historyEntry = cardHistory.find(e => e.subStepId === value)
    if (historyEntry) {
      scrollToCard(historyEntry.subStepId)
      return
    }
    const firstInStep = cardHistory.find(e => flow.subSteps[e.subStepId]?.step === value)
    if (firstInStep) {
      scrollToCard(firstInStep.subStepId)
    }
  }

  return (
    <Stepper.Root value={activeSubStepId} onValueChange={handleStepperClick} title={stepperTitle}>
      {Object.entries(flow.steps).map(([stepId, step]) => {
        const visited = visitedByStep[stepId] || []
        const predicted = predictedByStep[stepId] || []
        const isTerminalStep = !Object.values(flow.subSteps).some(s => s.step === stepId)
        const isActiveStep = activeStepId === stepId
        const hasBeenVisited = visited.length > 0

        const showSubSteps = hasBeenVisited || isActiveStep
        const activeHasNoNext = isActiveStep && !flow.subSteps[activeSubStepId]?.next
        const showIndeterminate = isActiveStep && !isTerminalStep && activeHasNoNext && predicted.length === 0

        const allSubStepsCompleted =
          hasBeenVisited && visited.every(e => e.status === 'completed' || e.status === 'skipped')
        const hasError = visited.some(e => e.status === 'error')
        const isFlowComplete = !cardHistory.some(e => e.status === 'active')
        const stepState = hasError
          ? 'error'
          : isFlowComplete && allSubStepsCompleted
            ? 'completed'
            : isActiveStep
              ? 'active'
              : allSubStepsCompleted
                ? 'completed'
                : 'upcoming'

        return (
          <Stepper.Step
            key={stepId}
            value={stepId}
            title={step.title}
            description={step.description}
            state={stepState}
            hasSubSteps={showIndeterminate}
          >
            {showSubSteps &&
              !isTerminalStep &&
              visited.map(entry => (
                <Stepper.SubStep
                  key={entry.subStepId}
                  value={entry.subStepId}
                  title={flow.subSteps[entry.subStepId]?.title}
                  description={flow.subSteps[entry.subStepId]?.description}
                  state={
                    entry.status === 'active'
                      ? 'active'
                      : entry.status === 'error'
                        ? 'error'
                        : entry.status === 'skipped'
                          ? 'skipped'
                          : 'completed'
                  }
                />
              ))}
            {isActiveStep &&
              !isTerminalStep &&
              predicted.map(subStepId => (
                <Stepper.SubStep
                  key={subStepId}
                  value={subStepId}
                  title={flow.subSteps[subStepId]?.title}
                  description={flow.subSteps[subStepId]?.description}
                  state="upcoming"
                />
              ))}
          </Stepper.Step>
        )
      })}
    </Stepper.Root>
  )
}

export function SplitPaneStepperRoot({ flow, onComplete, ...props }: SplitPaneStepperRootProps) {
  return (
    <FlowEngineProvider flow={flow} onComplete={onComplete}>
      <SplitPaneStepperContent {...props} />
    </FlowEngineProvider>
  )
}
