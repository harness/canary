import { type ComponentType, type CSSProperties, type ReactNode } from 'react'

import {
  type DrawerComponentProps,
  type FlowConfig,
  type ReactivationPrompt
} from '../flow-stepper/engine/engine-types'

export type {
  StepConfig,
  SubStepConfig,
  FlowConfig,
  CardStatus,
  CardEntry,
  DrawerResult,
  DrawerComponentProps,
  FlowCardContext,
  ReactivationPrompt
} from '../flow-stepper/engine/engine-types'

export interface SinglePaneStepperRootProps {
  flow: FlowConfig
  icon?: ReactNode
  title?: string
  stepperTitle?: string
  /** When true, renders stepperTitle above the timeline. Hidden by default. */
  showStepperHeader?: boolean
  contentTitle?: string
  contentSubtitle?: string
  drawers?: Record<string, ComponentType<DrawerComponentProps>>
  onComplete?: (state: Record<string, unknown>) => void
  onClose?: () => void
  /**
   * Show the root header (icon, title, close button). Shown by default when header content is
   * provided — set to false for PLG flows that use contentTitle instead.
   */
  showRootHeader?: boolean
  /**
   * @deprecated Use `showRootHeader` instead (`showRootHeader={false}` replaces `hideHeader`).
   */
  hideHeader?: boolean
  reactivationPrompt?: ReactivationPrompt
  // Disable auto-scrolling the active card into view (on mount and on transitions). Use for
  // completed/review flows where the timeline should render from the top and stay put.
  disableAutoScroll?: boolean
  /** Override the default 440px max-width (`.cn-single-pane-stepper-root`) — merged via `cn()`,
   *  so a utility class like `max-w-[600px]` reliably overrides the hardcoded default (Tailwind
   *  always emits `@layer utilities` after `@layer components`). */
  className?: string
  /** Inline-style escape hatch alongside `className`, for consumers that need computed values. */
  style?: CSSProperties
}

// CardAction props come from the shared FlowStepperCardAction (single source of truth).
export type { FlowStepperCardActionProps as CardActionProps } from '../flow-stepper/flow-stepper-card-action'
