import React, { KeyboardEvent, ReactNode, useEffect, useRef, useState } from 'react'

import { AlertDialog } from '@components/alert-dialog'
import { Skeleton } from '@components/skeletons'
import { Text } from '@components/text'
import { cn } from '@utils/cn'

import { StepperProvider, useStepperContext } from './stepper-context'
import { StepperProps } from './stepper-types'

function ProgressCounter() {
  const { orderedSteps, completed, effectiveActiveIndex } = useStepperContextInternal()

  if (completed) {
    return (
      <Text as="span" variant="body-normal" color="foreground-2">
        Complete
      </Text>
    )
  }

  const total = orderedSteps.length
  const current = effectiveActiveIndex + 1

  return (
    <Text as="span" variant="body-normal" color="foreground-2">
      Step {current}/{total}
    </Text>
  )
}

// Internal hook that also exposes effectiveActiveIndex for the counter
function useStepperContextInternal() {
  const ctx = useStepperContext()
  const activeIndex = ctx.orderedSteps.indexOf(ctx.value)

  // Check if value is a substep
  let effectiveActiveIndex = activeIndex
  if (activeIndex < 0) {
    for (const [parent] of ctx.subSteps.entries()) {
      const subs = ctx.subSteps.get(parent) || []
      if (subs.includes(ctx.value)) {
        effectiveActiveIndex = ctx.orderedSteps.indexOf(parent)
        break
      }
    }
  }

  return { ...ctx, effectiveActiveIndex }
}

function StepperList({ children }: { children: ReactNode }) {
  const { transitioning } = useStepperContext()

  const handleKeyDown = (e: KeyboardEvent<HTMLOListElement>) => {
    const list = e.currentTarget
    const buttons = Array.from(list.querySelectorAll<HTMLButtonElement>('button:not([disabled])'))
    const currentIndex = buttons.indexOf(e.target as HTMLButtonElement)
    if (currentIndex < 0) return

    let nextIndex: number | null = null

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        nextIndex = currentIndex < buttons.length - 1 ? currentIndex + 1 : currentIndex
        break
      case 'ArrowUp':
        e.preventDefault()
        nextIndex = currentIndex > 0 ? currentIndex - 1 : currentIndex
        break
      case 'Home':
        e.preventDefault()
        nextIndex = 0
        break
      case 'End':
        e.preventDefault()
        nextIndex = buttons.length - 1
        break
      default:
        return
    }

    if (nextIndex !== null) {
      buttons[nextIndex].focus()
    }
  }

  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
    <ol
      className={cn('cn-stepper-list', { 'cn-stepper-list-locked': transitioning !== null })}
      onKeyDown={handleKeyDown}
    >
      {children}
    </ol>
  )
}

function StepperLiveRegion() {
  const ctx = useStepperContext()
  const { orderedSteps, value } = ctx
  const [announcement, setAnnouncement] = useState('')
  const isFirstRender = useRef(true)
  const prevValueRef = useRef(value)

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    if (prevValueRef.current === value) return
    prevValueRef.current = value

    const stepIndex = orderedSteps.indexOf(value)
    if (stepIndex >= 0) {
      setAnnouncement(`Step ${stepIndex + 1} of ${orderedSteps.length}`)
    } else {
      // It's a substep value — just announce it
      setAnnouncement(value)
    }
  }, [value, orderedSteps])

  return (
    <span className="sr-only" aria-live="polite" aria-atomic="true">
      {announcement}
    </span>
  )
}

function StepperConfirmDialog() {
  const { pendingNavigation, confirmNavigation, cancelNavigation } = useStepperContext()
  if (!pendingNavigation) return null

  return (
    <AlertDialog.Root
      open={true}
      onOpenChange={open => {
        if (!open) cancelNavigation()
      }}
      onConfirm={confirmNavigation}
      onCancel={cancelNavigation}
      theme="warning"
    >
      <AlertDialog.Content title="Go back?">{pendingNavigation.message}</AlertDialog.Content>
    </AlertDialog.Root>
  )
}

function StepperSkeleton({ count }: { count: number }) {
  return (
    <ol className="cn-stepper-list" aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <li key={i} className="cn-stepper-skeleton-item">
          <Skeleton.Box className="cn-stepper-skeleton-indicator" />
          <div className="cn-stepper-skeleton-content">
            <Skeleton.Box className="cn-stepper-skeleton-title" />
            <Skeleton.Box className="cn-stepper-skeleton-description" />
          </div>
        </li>
      ))}
    </ol>
  )
}

function StepperBody({ children, skeletonCount }: { children: ReactNode; skeletonCount: number }) {
  // Show skeleton when no children are provided
  const hasChildren = React.Children.count(children) > 0

  if (!hasChildren) {
    return <StepperSkeleton count={skeletonCount} />
  }

  return <StepperList>{children}</StepperList>
}

export function StepperRoot({
  value,
  onValueChange,
  title,
  onBeforeChange,
  showConnectors = true,
  completed = false,
  skeletonCount = 3,
  className,
  children
}: StepperProps) {
  return (
    <StepperProvider
      value={value}
      onValueChange={onValueChange}
      onBeforeChange={onBeforeChange}
      showConnectors={showConnectors}
      completed={completed}
    >
      <nav className={cn('cn-stepper', className)} aria-label="Progress steps">
        <header className="cn-stepper-header">
          {title && (
            <Text as="span" variant="heading-small" color="foreground-2">
              {title}
            </Text>
          )}
          <ProgressCounter />
        </header>
        <StepperLiveRegion />
        <StepperBody skeletonCount={skeletonCount}>{children}</StepperBody>
        <StepperConfirmDialog />
      </nav>
    </StepperProvider>
  )
}
