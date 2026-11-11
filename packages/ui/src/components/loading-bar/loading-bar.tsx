import { forwardRef, HTMLAttributes } from 'react'

import { cn } from '@/utils/cn'

import type { LoadingBarController } from './loading-bar-controller'
import { useLoadingBar } from './use-loading-bar'

const DEFAULT_ARIA_LABEL = 'Loading'

export interface LoadingBarProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /**
   * Controlled mode: progress in the range 0..1. When `progress` or `visible` is provided
   * the bar ignores the controller and renders exactly what it is given.
   */
  progress?: number
  /** Controlled mode: whether the bar is shown. Defaults to `progress > 0` when only `progress` is given. */
  visible?: boolean
  /** Controller to follow. Defaults to the shared `loadingBar`. */
  controller?: LoadingBarController
  /** Render inline inside a relatively positioned parent instead of fixed to the top of the viewport. */
  inline?: boolean
}

/**
 * Thin progress bar for the top of the page. Mount it once near the app root; start/stop it through
 * `loadingBar`, `useLoadingBarTask` or `withLoadingBar`. The progress is simulated, see the controller.
 */
const LoadingBar = forwardRef<HTMLDivElement, LoadingBarProps>(
  ({ progress, visible, controller, inline = false, className, ...props }, ref) => {
    const controllerState = useLoadingBar(controller)
    const isControlled = progress !== undefined || visible !== undefined

    const currentProgress = Math.min(1, Math.max(0, isControlled ? (progress ?? 0) : controllerState.progress))
    const isVisible = isControlled ? (visible ?? currentProgress > 0) : controllerState.visible

    return (
      <div
        ref={ref}
        role="progressbar"
        aria-label={DEFAULT_ARIA_LABEL}
        aria-busy={isVisible}
        aria-hidden={!isVisible}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(currentProgress * 100)}
        data-state={isVisible ? 'visible' : 'hidden'}
        className={cn(
          inline ? 'absolute' : 'fixed',
          'top-0 left-0 right-0 pointer-events-none cn-loading-bar',
          { 'cn-loading-bar-inline': inline },
          className
        )}
        {...props}
      >
        <div
          className="cn-loading-bar-fill absolute inset-0 size-full origin-left will-change-transform"
          style={{ transform: `scaleX(${currentProgress})` }}
        >
          <div className="cn-loading-bar-peg absolute right-0 top-0 h-full" />
        </div>
      </div>
    )
  }
)
LoadingBar.displayName = 'LoadingBar'

export { LoadingBar }
