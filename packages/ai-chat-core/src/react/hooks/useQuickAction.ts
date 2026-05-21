import { useEffect } from 'react'

import type { QuickActionConfig } from '../../types/quick-action'
import { useAssistantRuntime } from './useAssistantRuntime'

/**
 * Register a quick action that appears in the welcome screen.
 * Automatically unregisters when the component unmounts.
 *
 * @param config - Quick action configuration
 * @param scope - The scope to register this action in (defaults to current active scope)
 *
 * @example
 * ```tsx
 * function PipelineQuickActions() {
 *   useQuickActionScope('pipelines', 'merge')
 *
 *   useQuickAction({
 *     id: 'list-pipelines',
 *     label: 'List pipelines',
 *     prompt: 'Show me all pipelines in this project',
 *     icon: 'pipeline',
 *     priority: 10
 *   }, 'pipelines')
 *
 *   return null
 * }
 * ```
 */
export function useQuickAction(config: QuickActionConfig, scope?: string): void {
  const runtime = useAssistantRuntime()

  useEffect(() => {
    const targetScope = scope || runtime.quickActionRegistry.getActiveScope()
    runtime.quickActionRegistry.register(config, targetScope)

    return () => {
      runtime.quickActionRegistry.unregister(config.id, targetScope)
    }
  }, [
    config.id,
    config.label,
    config.prompt,
    config.icon,
    config.description,
    config.priority,
    config.scope,
    scope,
    runtime
  ])
}
