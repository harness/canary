import { useMemo } from 'react'

import { cn } from '@utils/cn'

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

function resolveShowRootHeader(showRootHeader?: boolean, hideHeader?: boolean): boolean {
  if (showRootHeader !== undefined) return showRootHeader
  if (hideHeader !== undefined) return !hideHeader
  return true
}

function SinglePaneStepperContent({
  title,
  icon,
  stepperTitle,
  showStepperHeader,
  contentTitle,
  contentSubtitle,
  drawers,
  onClose,
  showRootHeader,
  hideHeader,
  reactivationPrompt,
  className,
  style,
  showStepBadge
}: Omit<SinglePaneStepperRootProps, 'flow' | 'onComplete'>) {
  const { drawerState, closeDrawer, pendingReactivation, confirmReactivation, cancelReactivation } = useEngineContext()

  const prompt = reactivationPrompt || DEFAULT_REACTIVATION_PROMPT
  const showHeader = resolveShowRootHeader(showRootHeader, hideHeader) && !!(icon || title || onClose)

  const activeDrawer = useMemo(() => {
    if (!drawerState || !drawers) return null
    const DrawerComponent = drawers[drawerState.id]
    if (!DrawerComponent) return null
    return <DrawerComponent open={true} onClose={closeDrawer} props={drawerState.props} />
  }, [drawerState, drawers, closeDrawer])

  return (
    <>
      <Layout.Vertical gap="none" className={cn('cn-single-pane-stepper-root', className)} style={style}>
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

        <SinglePaneStepperCardStack
          stepperTitle={stepperTitle}
          showStepperHeader={showStepperHeader}
          contentTitle={contentTitle}
          contentSubtitle={contentSubtitle}
          showStepBadge={showStepBadge}
        />
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

export function SinglePaneStepperRoot({ flow, onComplete, disableAutoScroll, ...props }: SinglePaneStepperRootProps) {
  return (
    <FlowEngineProvider flow={flow} onComplete={onComplete} disableAutoScroll={disableAutoScroll}>
      <SinglePaneStepperContent {...props} />
    </FlowEngineProvider>
  )
}
