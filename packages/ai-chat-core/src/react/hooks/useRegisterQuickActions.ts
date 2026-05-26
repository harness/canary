import { useEffect } from 'react'

import type { QuickActionConfig } from '../../types/quick-action'
import { useAssistantRuntime } from './useAssistantRuntime'

/**
 * Register multiple quick actions at once.
 *
 * All actions are automatically registered when the component mounts and
 * unregistered when it unmounts. This hook is useful for registering
 * multiple quick actions from a centralized configuration array.
 *
 * @param actions - Array of quick action configurations to register
 * @param scope - Optional scope for the actions (defaults to active scope)
 *
 * @example
 * ```tsx
 * const GLOBAL_ACTIONS = [
 *   { id: 'action-1', label: 'Action 1', prompt: 'Do action 1', icon: 'star' },
 *   { id: 'action-2', label: 'Action 2', prompt: 'Do action 2', icon: 'heart' },
 * ]
 *
 * function MyQuickActions() {
 *   useRegisterQuickActions(GLOBAL_ACTIONS, 'global')
 *   return null
 * }
 * ```
 */
export function useRegisterQuickActions(actions: QuickActionConfig[], scope?: string): void {
  const runtime = useAssistantRuntime()

  useEffect(() => {
    const targetScope = scope || runtime.quickActionRegistry.getActiveScope()

    // Register all actions
    actions.forEach(config => {
      runtime.quickActionRegistry.register(config, targetScope)
    })

    // Cleanup: unregister all actions on unmount
    return () => {
      actions.forEach(config => {
        runtime.quickActionRegistry.unregister(config.id, targetScope)
      })
    }
  }, [actions, scope, runtime])
}
