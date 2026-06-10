import { Children, isValidElement, useMemo } from 'react'

import { cn } from '@utils/cn'

import { AlertDialog } from '../alert-dialog'
import { IconV2 } from '../icon-v2'
import { Layout } from '../layout'
import { LogoV2 } from '../logo-v2'
import { Resizable } from '../resizable'
import { Stepper } from '../stepper'
import { Text } from '../text'
import { SplitPaneStepperCardStack } from './split-pane-stepper-card-stack'
import { FlowEngineProvider, useEngineContext } from './split-pane-stepper-context'
import { CardEntry, DrawerRegistrationProps, SplitPaneStepperRootProps } from './split-pane-stepper-types'

function SplitPaneStepperContent({
  title,
  stepperTitle,
  contentTitle,
  subtitle,
  onClose,
  leftPane,
  children
}: Omit<SplitPaneStepperRootProps, 'flow'>) {
  const { flow, drawerState, closeDrawer, pendingReactivation, confirmReactivation, cancelReactivation } =
    useEngineContext()

  const drawerRegistry = useMemo(() => {
    const registry = new Map<string, React.ComponentType<any>>()
    Children.forEach(children, child => {
      if (isValidElement(child) && typeof child.type === 'function') {
        const props = child.props as DrawerRegistrationProps
        if (props.id && props.component) {
          registry.set(props.id, props.component)
        }
      }
    })
    return registry
  }, [children])

  const activeDrawer = useMemo(() => {
    if (!drawerState) return null
    const DrawerComponent = drawerRegistry.get(drawerState.id)
    if (!DrawerComponent) return null
    return (
      <DrawerComponent
        open={true}
        onClose={(result: any) => {
          closeDrawer(result)
        }}
        props={drawerState.props}
      />
    )
  }, [drawerState, drawerRegistry, closeDrawer])

  const defaultLeftPane = <DefaultStepperPane stepperTitle={stepperTitle} title={title} />

  return (
    <>
      <Layout.Vertical gap="none" className="cn-split-pane-stepper-root">
        <Layout.Horizontal as="header" align="center" gap="sm" className="cn-split-pane-stepper-header">
          <LogoV2 name="harness" size="sm" />
          <Text as="h1" variant="heading-section" color="foreground-1" className="flex-1 min-w-0 !m-0">
            {title}
          </Text>
          {onClose && (
            <button type="button" onClick={onClose} aria-label="Close" className="cn-split-pane-stepper-close-btn">
              <IconV2 name="xmark" size="sm" />
            </button>
          )}
        </Layout.Horizontal>

        <Resizable.PanelGroup direction="horizontal" className="cn-split-pane-stepper-panels">
          <Resizable.Panel defaultSize={30} minSize={20} maxSize={40}>
            <div className="cn-split-pane-stepper-left-pane">
              {leftPane || defaultLeftPane}
            </div>
          </Resizable.Panel>

          <Resizable.Handle withHandle />

          <Resizable.Panel>
            <div className="cn-split-pane-stepper-right-pane">
              {(contentTitle || subtitle) && (
                <Layout.Vertical gap="2xs" className="cn-split-pane-stepper-content-header">
                  {contentTitle && (
                    <Text as="h2" variant="heading-subsection" color="foreground-1" className="!m-0">
                      {contentTitle}
                    </Text>
                  )}
                  {subtitle && (
                    <Text as="p" variant="body-normal" color="foreground-1" className="!m-0">
                      {subtitle}
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
        <AlertDialog.Content title="Go back?">
          Going back to this step will discard your progress on subsequent steps. Are you sure?
        </AlertDialog.Content>
      </AlertDialog.Root>
    </>
  )
}

function DefaultStepperPane({ stepperTitle, title }: { stepperTitle?: string; title: string }) {
  const { flow, cardHistory, activeSubStepId, predictedPath, scrollToCard } = useEngineContext()
  const activeStepId = flow.subSteps[activeSubStepId]?.step

  // Group visited substeps by step (in visitation order)
  const visitedByStep: Record<string, CardEntry[]> = {}
  for (const entry of cardHistory) {
    const stepId = flow.subSteps[entry.subStepId]?.step
    if (stepId) {
      if (!visitedByStep[stepId]) visitedByStep[stepId] = []
      visitedByStep[stepId].push(entry)
    }
  }

  // Group predicted substeps by step
  const predictedByStep: Record<string, string[]> = {}
  for (const subStepId of predictedPath) {
    const stepId = flow.subSteps[subStepId]?.step
    if (stepId) {
      if (!predictedByStep[stepId]) predictedByStep[stepId] = []
      predictedByStep[stepId].push(subStepId)
    }
  }


  const handleStepperClick = (value: string) => {
    // Check if it's a substep ID (in card history)
    const historyEntry = cardHistory.find(e => e.subStepId === value)
    if (historyEntry) {
      scrollToCard(historyEntry.subStepId)
      return
    }
    // Check if it's a step ID — scroll to first card in that step
    const firstInStep = cardHistory.find(e => flow.subSteps[e.subStepId]?.step === value)
    if (firstInStep) {
      scrollToCard(firstInStep.subStepId)
    }
  }

  return (
    <Stepper.Root value={activeSubStepId} onValueChange={handleStepperClick} title={stepperTitle || title}>
      {Object.entries(flow.steps).map(([stepId, step]) => {
        const visited = visitedByStep[stepId] || []
        const predicted = predictedByStep[stepId] || []
        const isTerminalStep = !Object.values(flow.subSteps).some(s => s.step === stepId)
        const isActiveStep = activeStepId === stepId
        const hasBeenVisited = visited.length > 0

        // Only show substeps for steps that have been entered
        // Active step shows visited + predicted
        // Visited (past) steps show their visited substeps
        // Future steps show nothing (just the step title)
        const showSubSteps = hasBeenVisited || isActiveStep
        // Show indeterminate only on active step when there's no next pointer
        const activeHasNoNext = isActiveStep && !flow.subSteps[activeSubStepId]?.next
        const showIndeterminate = isActiveStep && !isTerminalStep && activeHasNoNext && predicted.length === 0

        const allSubStepsCompleted = hasBeenVisited && visited.every(e => e.status === 'completed' || e.status === 'skipped')
        const hasError = visited.some(e => e.status === 'error')
        const isFlowComplete = !cardHistory.some(e => e.status === 'active')
        const stepState = hasError ? 'error' : (isFlowComplete && allSubStepsCompleted) ? 'completed' : isActiveStep ? 'active' : allSubStepsCompleted ? 'completed' : 'upcoming'

        return (
          <Stepper.Step
            key={stepId}
            value={stepId}
            title={step.title}
            description={step.description}
            state={stepState}
            hasSubSteps={showIndeterminate}
          >
            {showSubSteps && !isTerminalStep && visited.map(entry => (
              <Stepper.SubStep
                key={entry.subStepId}
                value={entry.subStepId}
                title={flow.subSteps[entry.subStepId]?.title}
                description={flow.subSteps[entry.subStepId]?.description}
                state={entry.status === 'active' ? 'active' : entry.status === 'error' ? 'error' : entry.status === 'skipped' ? 'skipped' : 'completed'}
              />
            ))}
            {isActiveStep && !isTerminalStep && predicted.map(subStepId => (
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

export function SplitPaneStepperRoot({ flow, ...props }: SplitPaneStepperRootProps) {
  return (
    <FlowEngineProvider flow={flow}>
      <SplitPaneStepperContent {...props} />
    </FlowEngineProvider>
  )
}
