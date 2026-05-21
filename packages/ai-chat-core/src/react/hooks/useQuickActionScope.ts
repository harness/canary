import { useEffect } from 'react'

import type { QuickActionScopeMode } from '../../types/quick-action'
import { useAssistantRuntime } from './useAssistantRuntime'

/**
 * Activate a quick action scope for the duration of this component's lifecycle.
 * When the component unmounts, the scope is deactivated and the previous scope is restored.
 *
 * Use this at the page/module level to declare "this page owns quick actions".
 *
 * @param scope - Unique identifier for this scope (e.g., "pipelines", "dashboards")
 * @param mode - How to display actions: 'merge' (global + current), 'replace' (only current), 'append' (all scopes)
 *
 * @example
 * ```tsx
 * function PipelinePage() {
 *   useQuickActionScope('pipelines', 'merge')
 *
 *   // Component automatically cleans up on unmount
 *   return <div>Pipeline content</div>
 * }
 * ```
 */
export function useQuickActionScope(scope: string, mode: QuickActionScopeMode = 'merge'): void {
  const runtime = useAssistantRuntime()

  useEffect(() => {
    runtime.quickActionRegistry.activateScope(scope, mode)

    return () => {
      runtime.quickActionRegistry.deactivateScope(scope)
    }
  }, [scope, mode, runtime])
}
