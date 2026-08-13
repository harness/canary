import { useMemo } from 'react'

import { AlertDialog } from '../alert-dialog'
import { FlowEngineProvider, useEngineContext } from '../flow-stepper/engine'
import { FlowStepperRail } from '../flow-stepper/flow-stepper-rail'
import { IconV2 } from '../icon-v2'
import { Layout } from '../layout'
import { Resizable } from '../resizable'
import { Text } from '../text'
import { DualPaneStepperCardStack } from './dual-pane-stepper-card-stack'
import { DualPaneStepperRootProps } from './dual-pane-stepper-types'

const DEFAULT_REACTIVATION_PROMPT = {
  title: 'Go back?',
  description: 'Going back to this step will discard your progress on subsequent steps. Are you sure?'
}

function DualPaneStepperContent({
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
}: Omit<DualPaneStepperRootProps, 'flow' | 'onComplete'>) {
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
      <Layout.Vertical gap="none" className="cn-dual-pane-stepper-root">
        {showHeader && (
          <Layout.Horizontal as="header" align="center" gap="sm" className="cn-dual-pane-stepper-header">
            {icon}
            {title && (
              <Text as="h1" variant="heading-section" color="foreground-1" className="min-w-0 flex-1 !m-0">
                {title}
              </Text>
            )}
            {!title && <div className="flex-1" />}
            {onClose && (
              <button type="button" onClick={onClose} aria-label="Close" className="cn-dual-pane-stepper-close-btn">
                <IconV2 name="xmark" size="sm" />
              </button>
            )}
          </Layout.Horizontal>
        )}

        <Resizable.PanelGroup direction="horizontal" className="cn-dual-pane-stepper-panels">
          <Resizable.Panel defaultSize={panels.default} minSize={panels.min} maxSize={panels.max}>
            <div className="cn-dual-pane-stepper-left-pane">{leftPane || defaultLeftPane}</div>
          </Resizable.Panel>

          <Resizable.Handle withHandle />

          <Resizable.Panel>
            <div className="cn-dual-pane-stepper-right-pane">
              {(contentTitle || contentSubtitle) && (
                <Layout.Vertical gap="2xs" className="cn-dual-pane-stepper-content-header">
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
              <DualPaneStepperCardStack />
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
  const { flow, cardHistory, activeStepId, predictedPath, scrollToCard } = useEngineContext()

  const handleStepperClick = (value: string) => {
    const historyEntry = cardHistory.find(e => e.stepId === value)
    if (historyEntry) {
      scrollToCard(historyEntry.stepId)
      return
    }
    const firstInStepGroup = cardHistory.find(e => flow.steps[e.stepId]?.step === value)
    if (firstInStepGroup) {
      scrollToCard(firstInStepGroup.stepId)
    }
  }

  return (
    <FlowStepperRail
      flow={flow}
      cardHistory={cardHistory}
      activeStepId={activeStepId}
      predictedPath={predictedPath}
      value={activeStepId}
      onValueChange={handleStepperClick}
      stepperTitle={stepperTitle}
      showStepperHeader
    />
  )
}

export function DualPaneStepperRoot({ flow, onComplete, disableAutoScroll, ...props }: DualPaneStepperRootProps) {
  return (
    <FlowEngineProvider flow={flow} onComplete={onComplete} disableAutoScroll={disableAutoScroll}>
      <DualPaneStepperContent {...props} />
    </FlowEngineProvider>
  )
}
