import { useEffect } from 'react'

import { CapabilityConfig } from '../../types/capability'
import { useAssistantRuntime } from './useAssistantRuntime'

export function useCapability<TArgs = any, TResult = any>(config: CapabilityConfig<TArgs, TResult>): void {
  const runtime = useAssistantRuntime()

  useEffect(() => {
    const priority = config.priority ?? 0

    // Register handler
    if (config.execute) {
      runtime.capabilityRegistry.registerHandler(config.name, { execute: config.execute }, priority)
    }

    // Register renderer
    if (config.render) {
      runtime.capabilityRegistry.registerRenderer(
        config.name,
        {
          component: config.render
        },
        priority
      )
    }

    // Cleanup on unmount
    return () => {
      runtime.capabilityRegistry.unregister(config.name)
    }
  }, [config.name, runtime])
}
