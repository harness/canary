import { useMemo } from 'react'

import { AlertDialog } from '../alert-dialog'
import { FlowEngineProvider, useEngineContext } from '../flow-stepper/engine'
import { IconV2 } from '../icon-v2'
import { Layout } from '../layout'
import { Text } from '../text'
import { SinglePaneStepperCardStack } from './single-pane-stepper-card-stack'
import { SinglePaneStepperRootProps } from './single-pane-stepper-types'

const DEFAULT_REACTIVATION_PROMPT = {
  title: 'Go back?',
  description: 'Going back to this step will discard your progress on subsequent steps. Are you sure?'
}

function SinglePaneStepperContent({
  title,
  icon,
  stepperTitle,
  contentTitle,
  contentSubtitle,
  drawers,
  onClose,
  reactivationPrompt
}: Omit<SinglePaneStepperRootProps, 'flow' | 'onComplete'>) {
  const { drawerState, closeDrawer, pendingReactivation, confirmReactivation, cancelReactivation } = useEngineContext()

  const prompt = reactivationPrompt || DEFAULT_REACTIVATION_PROMPT
  const showHeader = !!(icon || title)

  const activeDrawer = useMemo(() => {
    if (!drawerState || !drawers) return null
    const DrawerComponent = drawers[drawerState.id]
    if (!DrawerComponent) return null
    return <DrawerComponent open={true} onClose={closeDrawer} props={drawerState.props} />
  }, [drawerState, drawers, closeDrawer])

  return (
    <>
      <Layout.Vertical gap="none" className="cn-single-pane-stepper-root">
        {showHeader && (
          <Layout.Horizontal as="header" align="center" gap="sm" className="cn-single-pane-stepper-header">
            {icon}
            {title && (
              <Text as="h1" variant="heading-section" color="foreground-1" className="min-w-0 flex-1 !m-0">
                {title}
              </Text>
            )}
            {!title && <div className="flex-1" />}
            {onClose && (
              <button type="button" onClick={onClose} aria-label="Close" className="cn-single-pane-stepper-close-btn">
                <IconV2 name="xmark" size="sm" />
              </button>
            )}
          </Layout.Horizontal>
        )}

        {(contentTitle || contentSubtitle) && (
          <Layout.Vertical gap="2xs" className="cn-single-pane-stepper-content-header">
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

        <SinglePaneStepperCardStack stepperTitle={stepperTitle} />
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

export function SinglePaneStepperRoot({ flow, onComplete, ...props }: SinglePaneStepperRootProps) {
  return (
    <FlowEngineProvider flow={flow} onComplete={onComplete}>
      <SinglePaneStepperContent {...props} />
    </FlowEngineProvider>
  )
}
