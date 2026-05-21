import { useEffect, useState } from 'react'

import type { QuickAction, QuickActionFilter } from '../../types/quick-action'
import { useAssistantRuntime } from './useAssistantRuntime'

/**
 * Get all visible quick actions, respecting their condition functions and the active scope.
 *
 * @param filter - Optional filter by scope
 * @returns Array of visible quick actions, sorted by priority
 *
 * @example
 * ```tsx
 * function WelcomeScreen() {
 *   const quickActions = useQuickActions()
 *
 *   return (
 *     <div>
 *       {quickActions.map(action => (
 *         <Button key={action.id} onClick={() => send(action.prompt)}>
 *           {action.label}
 *         </Button>
 *       ))}
 *     </div>
 *   )
 * }
 * ```
 */
export function useQuickActions(filter?: QuickActionFilter): QuickAction[] {
  const runtime = useAssistantRuntime()
  const [actions, setActions] = useState<QuickAction[]>([])

  useEffect(() => {
    // Load visible actions
    runtime.quickActionRegistry.getVisible(filter).then(setActions)

    // Subscribe to runtime changes to re-evaluate
    const unsubscribe = runtime.subscribe(() => {
      runtime.quickActionRegistry.getVisible(filter).then(setActions)
    })

    return unsubscribe
  }, [runtime, filter?.scope])

  return actions
}
